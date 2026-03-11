import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './flutterwave.type';
import {bad} from "../../utils/errors"
import { generateReference } from 'src/utils/ref.util';
import { PrismaService } from '../prisma/prisma.service';
import { connectId } from 'prisma/prisma.util';
import { HttpService } from '@nestjs/axios';
import { OrderStatus } from '@prisma/client';
@Injectable()
export class FlutterwaveService {
    constructor(private prismaService: PrismaService,
        private readonly httpService: HttpService
    ) {}
    async initiatePayment(dto:CreatePaymentDto){

       try {
         const order =await this.prismaService.order.findUnique({
            where: { id: dto.orderId },
            include:{
                student:{
                    select:{
                        id:true,
                        email:true,
                        fullName:true,
                        profile:true
                    }
                }
            }
        });
        if(!order) bad ('Order not found');
        // check if order have been paid
        if(order.status === OrderStatus.SUCCESS) bad('Order has already been paid');


        // implement payment initiation logic here
        const txf =await generateReference()
      const record =await this.prismaService.$transaction(async(tx)=>{
          const payment =await tx.payment.create({
            data:{
                amount:order.amount,
                referenceId:txf,
                order:connectId(order.id)
            }
        })
        // call the flutterwave method
        const response =await this.httpService.axiosRef.post("https://api.flutterwave.com/v3/payments",{
            tx_Ref:payment.referenceId,
            amount:order.amount,
            currency:"NGN",
            email:order.student.email,
            redirect_url:process.env.FLUTTERWAVE_REDIRECT_URL,
            customer:{
                email:order.student.email,
                name:order.student.fullName,
                phone:order.student.profile?.phoneNumber
            }
        },{
            headers: {
				Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
				'Content-Type': 'application/json',
			},
		}
        )
        if(response.data.status !==OrderStatus.SUCCESS) bad("failed to initiate payment")
        // create transaction 
        await tx.transaction.create({
            data:{
                payment:connectId(payment.id),
                amount:order.amount,
                user:connectId(order.student.id),
                referenceId:txf,
                paymentReference:response.data.data.flw_ref??null,
                originatorName:order.student.fullName,
                originatorAccount:order.student.profile?.phoneNumber,
                narration:`payment for order ${order.orderNumber}`

            }
        })
          return {
        message: 'Payment initiated successfully',
        payment_link: response.data.data.link,
      };
      })
      return record
       
       } catch (error) {
        console.log("error",error)
       }
    }
}
