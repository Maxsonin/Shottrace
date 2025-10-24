import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { Public } from "src/common/decorators/public.decorator";
import { User } from "src/common/decorators/user.decorator";
import { JwtRefreshGuard } from "src/common/guards/rt.guard";
import { AuthService } from "./auth.service";
import { REFRESH_TOKEN_COOKIE } from "./constants/constants";
import { SignInLocalDto, SignUpLocalDto } from "./dtos/auth.dto";
import { AuthUser } from "./types/auth.type";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post("local/signup")
	async signUpLocal(
		@Body() dto: SignUpLocalDto,
		@Res({ passthrough: true }) res,
	): Promise<{ success: true; accessToken: string }> {
		const tokens = await this.authService.signUpLocal(dto);
		this.authService.getRefreshTokenCookie(res, tokens.refreshToken);
		return { success: true, accessToken: tokens.accessToken };
	}

	@Public()
	@Post("local/signin")
	async signinLocal(
		@Body() dto: SignInLocalDto,
		@Res({ passthrough: true }) res,
	): Promise<{ success: true; accessToken: string }> {
		const tokens = await this.authService.signinLocal(dto);
		this.authService.getRefreshTokenCookie(res, tokens.refreshToken);
		return { success: true, accessToken: tokens.accessToken };
	}

	@Post("logout")
	async logoutLocal(@User() user: AuthUser, @Res({ passthrough: true }) res) {
		await this.authService.logoutLocal(user.userId);
		res.clearCookie(REFRESH_TOKEN_COOKIE);
		return { success: true, message: "Logged out successfully" };
	}

	@Public()
	@UseGuards(JwtRefreshGuard)
	@Get("refresh")
	async refreshTokens(
		@User() user: AuthUser,
		@Res({ passthrough: true }) res,
	): Promise<{ success: true; accessToken: string }> {
		const tokens = await this.authService.refreshTokens(
			user.userId,
			user.refreshToken!,
		);
		this.authService.getRefreshTokenCookie(res, tokens.refreshToken);
		return { success: true, accessToken: tokens.accessToken };
	}

	@Get("me")
	me(@User() user: AuthUser) {
		return user;
	}
}
