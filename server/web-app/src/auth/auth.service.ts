import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInLocalDto, SignUpLocalDto } from './dtos/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { Tokens } from './types/auth.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async hashData(data: string): Promise<string> {
    return await bcrypt.hash(data, 10);
  }

  async getTokens(userId: number, username: string): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, username },
        { secret: 'at-secret', expiresIn: '15m' },
      ),
      this.jwtService.signAsync(
        { sub: userId, username },
        { secret: 'rt-secret', expiresIn: '7d' },
      ),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  async updateRefreshTokenHash(userId: number, refreshToken: string) {
    const refreshTokenHash = await this.hashData(refreshToken);
    await this.userService.updateRefreshTokenHash(userId, refreshTokenHash);
  }

  async signUpLocal(dto: SignUpLocalDto): Promise<Tokens> {
    const passwordHash = await this.hashData(dto.password);
    const newUser = await this.userService.createUser(
      dto.email,
      dto.username,
      passwordHash,
    );

    const tokens = await this.getTokens(newUser.id, newUser.username);
    await this.updateRefreshTokenHash(newUser.id, tokens.refreshToken);
    return tokens;
  }

  async signinLocal(dto: SignInLocalDto): Promise<Tokens> {
    const user = await this.userService.findOneByUsername(dto.username);

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async logoutLocal(userId: number) {
    await this.userService.updateRefreshTokenHash(userId, null);
  }

  async refreshTokens(userID: number, rt: string): Promise<Tokens> {
    const user = await this.userService.findOneById(userID);

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const rtMatches = await bcrypt.compare(rt, user.refreshTokenHash);
    if (!rtMatches) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.getTokens(user.id, user.username);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
    return tokens;
  }
}
