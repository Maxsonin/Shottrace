import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import ms, { type StringValue } from 'ms';

import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  generateAccessToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      secret: this.config.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: ms(
        this.config.getOrThrow<StringValue>('JWT_ACCESS_TOKEN_EXPIRATION'),
      ),
    });
  }

  generateRefreshToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      secret: this.config.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: ms(
        this.config.getOrThrow<StringValue>('JWT_REFRESH_TOKEN_EXPIRATION'),
      ),
    });
  }

  generateTokens(payload: TokenPayload) {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }
}
