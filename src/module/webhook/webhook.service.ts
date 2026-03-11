import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { OrderStatus, PaymentStatus, TransactionStatus } from '@prisma/client';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { bad } from 'src/utils/errors';
import { EnrollmentService } from '../enrollment/enrollment.service';
import { sendOrderEmailVerification } from 'src/services/event/event.type';
@Injectable()
export class WebhookService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly enrollmentService: EnrollmentService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async handlePaymentWebhook(req, res) {
    const secretHash = process.env.FLW_SECRET_HASH;
    if (!secretHash) bad('FLW_SECRET_HASH is not defined');
    const signature = req.headers['verif-hash'];

    if (!signature || signature !== secretHash)
      return res.status(200).send(' invalid signature');
    // get information from the webhook data
    const event = req.body;
    // check if the event was successfull
    if (event.data.status !== 'successful') bad('payment not successfull');
    const txRef = event.data.tx_ref;
    //   check for transaction in the db
    const transaction = await this.prismaService.transaction.findFirst({
      where: {
        referenceId: txRef,
      },
      include: {
        payment: {
          include: {
            order: true,
          },
        },
      },
    });
    if (!transaction) return res.status(200).send('transaction not found');

    if (transaction.status === TransactionStatus.SUCCESS)
      return res.status(200).send('transaction already processed');
    // update transaction ,payment ,order,enrollment
    const result = await this.prismaService.$transaction(async (tx) => {
      const updatedTransaction = await tx.transaction.update({
        where: {
          id: transaction.id,
        },

        data: {
          status: TransactionStatus.SUCCESS,
        },
      });
      // update payment
      const updatedPayment = await tx.payment.update({
        where: {
          id: transaction.paymentId,
        },
        data: {
          status: PaymentStatus.SUCCESS,
        },
      });
      // update order
      const updatedOrder = await tx.order.update({
        where: {
          id: transaction.payment.order.id,
        },
        data: {
          status: OrderStatus.SUCCESS,
        },
      });
      await this.enrollmentService.createEnrollment(
        transaction.payment.order.id,
        transaction.userId,
      );
      // send email notification
      this.eventEmitter.emit("payment.sucess",
        new sendOrderEmailVerification(transaction.payment.orderId)

      )

      return {
        transaction: updatedTransaction,
        payment: updatedPayment,
        order: updatedOrder,
      };
    });
    return res.status(200).send('webhook processed successfully');
  }
}
