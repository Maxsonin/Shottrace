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
import type { Response } from 'express';

import { SignUpDto, UserDto } from '@repo/api';
import { AuthService } from './services/auth.service';
import { RefreshDocs, SignInDocs, SignUpDocs } from './auth.docs';

import { ApiDoc } from '../../shared/decorators/api-doc.decorator';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { GoogleAuthGuard } from '../../shared/guards/google-auth.guard';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from '../../shared/guards/jwt-refresh-auth.guard';
import { LocalAuthGuard } from '../../shared/guards/local-auth.guard';
import { toResponse } from '../../shared/utils/to-response.util';
import type { User } from '../../generated/prisma/client';

@Controller('auth')
export class AuthController {
  private readonly redirectUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    this.redirectUrl = this.configService.getOrThrow('GOOGLE_UI_REDIRECT_URI');
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
    return toResponse(UserDto, loggedInUser);
  }

  @ApiDoc(SignUpDocs)
  @Post('signup')
  async register(
    @Body() createUserDto: SignUpDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.register(createUserDto);
    const loggedInUser = await this.authService.login(user, response);
    return toResponse(UserDto, loggedInUser);
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
    return toResponse(UserDto, loggedInUser);
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

  @ApiDoc({
    summary: 'Get currently logged in user',
    responses: [
      {
        status: HttpStatus.OK,
        type: UserDto,
        description: 'Returns currently logged in user',
      },
    ],
  })
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: User) {
    return toResponse(UserDto, user);
  }
}
