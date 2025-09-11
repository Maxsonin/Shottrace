import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayload, UserEntity } from '../types/auth.type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: (req: Request) => {
        return req?.cookies?.refreshToken;
      },
      secretOrKey: 'rt-secret', // TODO: move to env
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<UserEntity> {
    const refreshToken = req.cookies?.refreshToken;
    return {
      userId: Number(payload.sub),
      username: payload.username,
      refreshToken,
    };
  }
}
