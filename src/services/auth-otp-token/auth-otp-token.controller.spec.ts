import { Test, TestingModule } from '@nestjs/testing';
import { AuthOtpTokenController } from './auth-otp-token.controller';
import { AuthOtpTokenService } from './auth-otp-token.service';

describe('AuthOtpTokenController', () => {
  let controller: AuthOtpTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthOtpTokenController],
      providers: [AuthOtpTokenService],
    }).compile();

    controller = module.get<AuthOtpTokenController>(AuthOtpTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
