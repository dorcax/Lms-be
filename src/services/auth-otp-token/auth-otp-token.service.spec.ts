import { Test, TestingModule } from '@nestjs/testing';
import { AuthOtpTokenService } from './auth-otp-token.service';

describe('AuthOtpTokenService', () => {
  let service: AuthOtpTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthOtpTokenService],
    }).compile();

    service = module.get<AuthOtpTokenService>(AuthOtpTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
