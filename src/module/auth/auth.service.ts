import { Injectable } from '@nestjs/common';
import {
  CreateAuthDto,
  CreateLoginDto,
  VerifyOtpDto,
} from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { bad } from 'src/utils/errors';
import * as argon from 'argon2';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthOtpTokenService } from 'src/services/auth-otp-token/auth-otp-token.service';
import { addMinutes } from 'date-fns';
import { Verification_Mail } from 'src/services/event/event.type';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly authOtpToken: AuthOtpTokenService,
    private jwtService: JwtService,
  ) {}
  async create(dto: CreateAuthDto) {
    const { fullName, email, password, role } = dto;
    // check if user exist before
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) bad('user already exist ');

    // create user
    const user = await this.prisma.user.create({
      data: {
        fullName,
        email,
        password: await argon.hash(password),
        role,
      },
    });
    // generate code

    const generateCode = await this.authOtpToken.create({
      email,
      subject: 'verify your email ',
      type: 'OTP',
      userId: user.id,
      expiry: addMinutes(new Date(), 15),
    });
    const year = new Date().getFullYear();
    this.eventEmitter.emit(
      'verification_mail',
      new Verification_Mail(email, generateCode.code, fullName, year),
    );

    return {
      message: 'user successfully registered',
    };
  }

  // login user
  async login(dto: CreateLoginDto, res) {
    const { email, password } = dto;
    // check if the email exist
    const existingEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingEmail) bad('invalid credentials');
    // check if user verified
    if (!existingEmail.isVerified) {
      // resend code
      return { isVerified: false };
    }

    // compare password
    const isMatch = await argon.verify(existingEmail.password, password);
    if (!isMatch) bad('invalid credentials');

    const token = await this.generateToken(
      existingEmail.id,
      email,
      existingEmail.role,
      existingEmail.tokenVersion,
    );
    // await this.updateRefreshToken(existingEmail.id, token.refreshToken);
    res.cookie('refresh_token', token.refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });
    return {
      message: 'user logged in successfully',
      token: token.accessToken,
    };
  }
  // refresh token
  async refreshTokens(refreshToken: string, res) {
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
    if (!payload) bad('invalid token ');

    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    if (!user) bad('invalid user ');
    // if (!user.refreshToken) bad('no refresh token stored');
    // compare the hashed token
    // const isMatch = await argon.verify(user.refreshToken, refreshToken);
    // if (!isMatch) bad('invalid credentials');
    if (payload.tokenVersion !== user.tokenVersion)
      bad('Refresh token invalid (tokenVersion mismatch)');
    const newTokenVersion = user.tokenVersion + 1;
    const token = await this.generateToken(
      user.id,
      user.email,
      user.role,
      newTokenVersion,
    );
    await this.updateRefreshToken(user.id);
    res.cookie('refresh_token', token.refreshToken, {
      httpOnly: true,

      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });
    return {
      token,
    };
  }

  // verify the otp code
  async activateCode(dto: VerifyOtpDto) {
    const otpCode = await this.authOtpToken.findCode(dto.code);
    if (!otpCode) bad('invalid otp ');
    // verify the code
    const verifiedCode = await this.authOtpToken.verityOtp(
      {
        code: otpCode.code,
        subject: 'verify email',
      },
      false,
    );

    if (!verifiedCode) bad('otp verification code failed ');

    // update the user
    const user = await this.prisma.user.update({
      where: {
        id: otpCode.userId,
      },
      data: {
        isVerified: true,
      },
    });
    await this.authOtpToken.deleteOtp(otpCode.id);
    return {
      message: 'email verified successfully ',
    };
  }

  async logout(userId: string, res) {
    await this.updateRefreshToken(userId);
    res.clearCookie('refresh_token');
    return  {
      message:"user logged out successfully"
    }
  }

  // function to generate accesstoken and refresh token
  async generateToken(
    userId: string,
    email: string,
    role: string,
    tokenVersion: number,
  ) {
    const payload = { sub: userId, email, role, tokenVersion };
    const accessToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '1d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
  // update refresh token
  async updateRefreshToken(userId: string) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        tokenVersion: { increment: 1 },
      },
    });
  }
}
