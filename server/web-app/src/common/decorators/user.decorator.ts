import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/auth/types/auth.type';

export const User = createParamDecorator(
  (data: keyof UserEntity | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserEntity | null = request.user ?? null;

    if (!user) return null;

    return data ? (user[data] ?? null) : user;
  },
);
