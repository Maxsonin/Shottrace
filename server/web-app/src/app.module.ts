import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { JwtAuthGuard } from './common/guards/jwt.guard';
import { ConfigModule } from '@nestjs/config';
import { ReviewModule } from './review/review.module';
import { CommentModule } from './comment/comment.module';
import envConfig from './config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    ReviewModule,
    CommentModule,
  ],
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
