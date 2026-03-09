import { Controller } from '@nestjs/common';
import { FlutterwaveService } from './flutterwave.service';

@Controller('flutterwave')
export class FlutterwaveController {
  constructor(private readonly flutterwaveService: FlutterwaveService) {}
}
