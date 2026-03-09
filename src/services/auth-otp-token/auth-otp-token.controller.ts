import { Controller } from '@nestjs/common';
import { AuthOtpTokenService } from './auth-otp-token.service';

@Controller('auth-otp-token')
export class AuthOtpTokenController {
  constructor(private readonly authOtpTokenService: AuthOtpTokenService) {}
}
