import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CommentModule } from "./modules/comment/comment.module";
import { JwtAuthGuard } from "./common/guards/jwt.guard";
import envConfig from "./core/config/env.config";
import { PrismaModule } from "./core/prisma/prisma.module";
import { RedisModule } from "./core/redis/redis.module";
import { ReviewModule } from "./modules/review/review.module";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";

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
