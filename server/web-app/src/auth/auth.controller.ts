import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  UseGuards,
  Get,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { SignInLocalDto, SignUpLocalDto } from './dtos/auth.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { JwtRefreshGuard } from 'src/common/guards/rt.guard';
import { UserEntity } from './types/auth.type';
import { User } from 'src/common/decorators/user.decorator';

const getRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  async signUpLocal(
    @Body() dto: SignUpLocalDto,
    @Res({ passthrough: true }) res,
  ): Promise<{ accessToken: string }> {
    const tokens = await this.authService.signUpLocal(dto);
    getRefreshTokenCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Public()
  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  async signinLocal(
    @Body() dto: SignInLocalDto,
    @Res({ passthrough: true }) res,
  ): Promise<{ accessToken: string }> {
    const tokens = await this.authService.signinLocal(dto);
    getRefreshTokenCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logoutLocal(@User() user: UserEntity, @Res({ passthrough: true }) res) {
    this.authService.logoutLocal(user.userId);
    res.clearCookie('refreshToken');
    return { message: 'Logged out' };
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @User() user: UserEntity,
    @Res({ passthrough: true }) res,
  ): Promise<{ accessToken: string }> {
    if (!user.refreshToken) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.authService.refreshTokens(
      user.userId,
      user.refreshToken,
    );
    getRefreshTokenCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  getMe(@User() user: UserEntity) {
    return user;
  }
}
