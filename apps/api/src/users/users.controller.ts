import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'prisma/client/generated/client';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiDoc } from 'src/common/decorators/api-doc.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('me')
  @ApiDoc({ summary: 'Get current user', auth: true })
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: User) {
    return user;
  }
}
