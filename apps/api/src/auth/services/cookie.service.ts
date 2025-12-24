import { Injectable } from '@nestjs/common';
import { Response } from 'express';

import { isProd } from 'src/common/utils/env.util';

@Injectable()
export class CookieService {
  private readonly ACCESS_TOKEN_COOKIE = 'Authentication';
  private readonly REFRESH_TOKEN_COOKIE = 'Refresh';

  setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie(this.ACCESS_TOKEN_COOKIE, accessToken, {
      httpOnly: true,
      secure: isProd,
    });
    res.cookie(this.REFRESH_TOKEN_COOKIE, refreshToken, {
      httpOnly: true,
      secure: isProd,
    });
  }

  clearAuthCookies(res: Response) {
    res.clearCookie(this.ACCESS_TOKEN_COOKIE, { httpOnly: true, path: '/' });
    res.clearCookie(this.REFRESH_TOKEN_COOKIE, { httpOnly: true, path: '/' });
  }
}
