import { ConfigService } from '@nestjs/config';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Redirect,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { SignUpDto, UserDto } from '@repo/api';
import { User } from 'prisma/client/generated/client';

import { AuthService } from './services/auth.service';
import { RefreshDocs, SignInDocs, SignUpDocs } from './auth.docs';

import { ApiDoc } from '../common/decorators/api-doc.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { GoogleAuthGuard } from '../common/guards/google-auth.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from '../common/guards/jwt-refresh-auth.guard';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { toDto } from '../common/utils/to-dto.util';

@Controller('auth')
export class AuthController {
  private readonly redirectUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    this.redirectUrl = this.configService.getOrThrow('AUTH_UI_REDIRECT');
  }

  @ApiDoc(SignInDocs)
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async signIn(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    const loggedInUser = await this.authService.login(user, response);
    return toDto(UserDto, loggedInUser);
  }

  @ApiDoc(SignUpDocs)
  @Post('signup')
  async register(@Body() createUserDto: SignUpDto) {
    const user = await this.authService.register(createUserDto);
    return toDto(UserDto, user);
  }

  @ApiDoc({
    summary: 'Logout',
    description: 'Clear authentication cookies and invalidate refresh token',
    auth: true,
    responses: [
      { status: HttpStatus.OK, description: 'Successfully logged out' },
    ],
  })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(user.id, response);
    return { message: 'Logged out successfully' };
  }

  @ApiDoc(RefreshDocs)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    const loggedInUser = await this.authService.login(user, response);
    return toDto(UserDto, loggedInUser);
  }

  @ApiDoc({
    summary: 'Sign in/up with Google',
    description: 'Redirects to Google OAuth consent screen',
  })
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  loginGoogle() {}

  @ApiDoc({
    summary: 'Google OAuth callback',
    description:
      'Handles Google login/signup, sets cookies, and redirects to frontend',
    responses: [
      {
        status: HttpStatus.FOUND,
        description: 'Redirects user to frontend after successful login',
      },
      {
        status: HttpStatus.UNAUTHORIZED,
        description: 'Unauthorized if Google login fails',
      },
    ],
  })
  @Get('google/callback')
  @Redirect()
  @UseGuards(GoogleAuthGuard)
  async googleCallback(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    return { url: this.redirectUrl };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: User) {
    return toDto(UserDto, user);
  }
}
