import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { MoviesModule } from './modules/movies/movies.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { CommentsModule } from './modules/comments/comments.module';
import { HealthModule } from './infrastructure/health/health.module';
import { validate } from './infrastructure/config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),

    PrismaModule,
    HealthModule,

    UsersModule,
    AuthModule,

    MoviesModule,
    ReviewsModule,
    CommentsModule,
  ],
})
export class AppModule {}
