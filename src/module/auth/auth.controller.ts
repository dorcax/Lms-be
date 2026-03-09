import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, CreateLoginDto, VerifyOtpDto, ResendOtpDto } from './dto/create-auth.dto';
import { AuthUser, Cookies } from './decorators/auth.decorator';
import { userEntity } from './entities/auth.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-up")
  create(@Body() dto: CreateAuthDto) {
    return this.authService.create(dto);
  }

@Post('login')
  login(@Body() dto:CreateLoginDto,@Res() res:Response){
    return this.authService.login(dto,res )
  }

   @Post('verify-otp')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.activateCode(dto);
  }

  // @Post('resend-verify')
  // async resendVerify(@Body() dto: ResendOtpDto) {
  //   return this.authService.resendVerification(dto);
  // }


    @Post('refresh')
  async refresh(
     @Cookies('refresh_token') refreshToken: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
   

    return this.authService.refreshTokens(refreshToken, res);
  }

  // LOGOUT
  @Post('logout')
  async logout(
     @Cookies('refresh_token') refreshToken: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @AuthUser() user:userEntity
  ) {


    if (!refreshToken) {
      return { message: 'No refresh token provided' };
    }

    return this.authService.logout(user.id, res);

  }
}
