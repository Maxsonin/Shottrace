import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { AuthService } from '../services/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.getOrThrow('GOOGLE_AUTH_CLIENT_ID'),
      clientSecret: configService.getOrThrow('GOOGLE_AUTH_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow('GOOGLE_AUTH_REDIRECT_URI'),
      scope: ['profile', 'email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    cb: VerifyCallback,
  ) {
    const googleUser = await this.authService.verifyGoogleUser({
      email: profile.emails[0]?.value,
      username: profile.displayName,
      password: '',
    });

    cb(null, googleUser);
  }
}
