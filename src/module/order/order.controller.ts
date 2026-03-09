import { Body, Controller, Post ,Get} from '@nestjs/common';
import { OrderService } from './order.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRole } from '@prisma/client';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Auth([UserRole.STUDENT])
  @Post("checkout")
  async orderCheckOut(cartId: string, @Body("billingAddress") billingAddress: string) {
    return this.orderService.orderCheckOut(cartId, billingAddress);
  }


  // get all orders
  @Auth([UserRole.STUDENT])
  @Get()
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }
  
}
