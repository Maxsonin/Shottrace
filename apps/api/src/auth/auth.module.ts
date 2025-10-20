import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtRefreshStrategy } from "./strategies/rt.strategy";

@Module({
	imports: [JwtModule.register({}), UserModule],
	providers: [AuthService, JwtStrategy, JwtRefreshStrategy],
	controllers: [AuthController],
})
export class AuthModule {}
