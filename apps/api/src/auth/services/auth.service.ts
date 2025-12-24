import { Injectable } from '@nestjs/common';
import { Response } from 'express';

import { SignUpDto } from '@repo/api';
import { User } from 'prisma/client/generated/client';

import { TokenService } from './token.service';
import { CookieService } from './cookie.service';

import { UsersService } from '../../users/users.service';
import type { TokenPayload } from '../interfaces/token-payload.interface';

import { verify } from '../../common/utils/hash.util';
import { InvalidCredentialsException } from '../../common/exception/invalid-credentials.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
    private readonly cookieService: CookieService,
  ) {}

  async login(user: User, response: Response) {
    const payload: TokenPayload = { userId: user.id };
    const { accessToken, refreshToken } =
      this.tokenService.generateTokens(payload);

    await this.userService.updateUserRefreshToken(user.id, refreshToken);

    this.cookieService.setAuthCookies(response, accessToken, refreshToken);

    return user;
  }

  async register(dto: SignUpDto) {
    return this.userService.create(dto);
  }

  async logout(userId: string, response: Response) {
    await this.userService.clearUserRefreshToken(userId);
    this.cookieService.clearAuthCookies(response);
  }

  async verifyUser(email: string, password: string) {
    if (!email || !password) {
      throw new InvalidCredentialsException();
    }

    const user = await this.userService.getUserByEmail(email);
    if (!user || !(await verify(user.passwordHash, password))) {
      throw new InvalidCredentialsException();
    }

    return user;
  }
  async verifyUserRefreshToken(refreshToken: string, userId: string) {
    const user = await this.userService.getUserById(userId);
    if (!user || !(await verify(user.refreshTokenHash, refreshToken))) {
      throw new InvalidCredentialsException();
    }
    return user;
  }
  async verifyGoogleUser(googleUser: SignUpDto) {
    const existing = await this.userService.getUserByEmail(googleUser.email);
    return existing ?? this.userService.createGoogle(googleUser);
  }
}
