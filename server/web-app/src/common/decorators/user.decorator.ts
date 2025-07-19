import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/auth/types/auth.type';

export const User = createParamDecorator(
  (data: keyof UserEntity | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: UserEntity = request.user;
    return data ? user?.[data] : user;
  },
);
