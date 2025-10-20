import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { CommentModule } from "./comment/comment.module";
import { JwtAuthGuard } from "./common/guards/jwt.guard";
import envConfig from "./config/env.config";
import { PrismaModule } from "./prisma/prisma.module";
import { RedisModule } from "./redis/redis.module";
import { ReviewModule } from "./review/review.module";
import { UserModule } from "./user/user.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [envConfig],
		}),
		AuthModule,
		PrismaModule,
		RedisModule,
		UserModule,
		ReviewModule,
		CommentModule,
	],
	providers: [
		{
			provide: "APP_GUARD",
			useClass: JwtAuthGuard,
		},
	],
})
export class AppModule {}
