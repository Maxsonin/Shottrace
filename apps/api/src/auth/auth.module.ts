import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';

import { AuthController } from './auth.controller';

import { AuthService } from './services/auth.service';
import { CookieService } from './services/cookie.service';
import { TokenService } from './services/token.service';

import { GoogleStrategy } from './strategies/google.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [UsersModule, JwtModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    GoogleStrategy,
    JwtRefreshStrategy,
    JwtStrategy,
    CookieService,
    TokenService,
  ],
})
export class AuthModule {}
