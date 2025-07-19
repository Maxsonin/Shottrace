import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { JwtAuthGuard } from './common/guards/jwt.guard';

@Module({
  imports: [AuthModule, PrismaModule, UserModule],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
