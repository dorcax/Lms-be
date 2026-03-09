import { Module } from '@nestjs/common';
import { FlutterwaveService } from './flutterwave.service';
import { FlutterwaveController } from './flutterwave.controller';
import {HttpModule} from "@nestjs/axios"

@Module({
  imports: [HttpModule],
  controllers: [FlutterwaveController],
  providers: [FlutterwaveService],
})
export class FlutterwaveModule {}
