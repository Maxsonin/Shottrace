import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from '../common/utils/hash.util';
import { PrismaClientKnownRequestError } from 'prisma/client/generated/internal/prismaNamespace';
import { SignUpDto } from '@repo/api';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ email, username, password }: SignUpDto) {
    try {
      return await this.prisma.user.create({
        data: {
          email,
          username,
          passwordHash: await hash(password),
        },
      });
    } catch (err) {
      if (
        err instanceof PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        if (err.meta.target == 'email')
          throw new ConflictException('Email already exists');
        if (err.meta.target == 'username')
          throw new ConflictException('Username already exists');
      }
      throw err;
    }
  }
  async createGoogle({ email, username }: SignUpDto) {
    return this.prisma.user.create({
      data: { email, username, passwordHash: '' },
    });
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
  async getUserById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateUserRefreshToken(userId: string, refreshToken: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: await hash(refreshToken) },
    });
  }
  async clearUserRefreshToken(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: '' },
    });
  }
}
