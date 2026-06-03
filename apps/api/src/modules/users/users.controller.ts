import { Controller, Get, HttpStatus, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import type { User } from '../../generated/prisma/client';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard';
import { ApiDoc } from '../../shared/decorators/api-doc.decorator';
import { UserDto } from '@repo/api';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('me')
  @ApiDoc({
    summary: 'Get current user info',
    auth: true,
    responses: [
      {
        status: HttpStatus.OK,
        type: UserDto,
      },
    ],
  })
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: User) {
    return user;
  }
}
