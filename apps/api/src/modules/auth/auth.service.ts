import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { Response } from "express";
import { UserService } from "src/modules/user/user.service";
import {
	ACCESS_TOKEN_EXPIRATION,
	ACCESS_TOKEN_SECRET,
	REFRESH_TOKEN_COOKIE,
	REFRESH_TOKEN_EXPIRATION,
	REFRESH_TOKEN_SECRET,
} from "./constants/constants";
import { SignInLocalDto, SignUpLocalDto } from "./dtos/auth.dto";
import { Tokens } from "./types/auth.type";

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
	) {}

	private readonly SALT_ROUNDS = 10;

	async hashData(data: string): Promise<string> {
		return bcrypt.hash(data, this.SALT_ROUNDS);
	}

	getRefreshTokenCookie(res: Response, token: string) {
		res.cookie(REFRESH_TOKEN_COOKIE, token, {
			httpOnly: true,
			secure: true,
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		});
	}

	private async createAccessToken(userId: number, username: string) {
		return this.jwtService.signAsync(
			{ sub: userId, username },
			{ secret: ACCESS_TOKEN_SECRET, expiresIn: ACCESS_TOKEN_EXPIRATION },
		);
	}

	private async createRefreshToken(userId: number, username: string) {
		return this.jwtService.signAsync(
			{ sub: userId, username },
			{ secret: REFRESH_TOKEN_SECRET, expiresIn: REFRESH_TOKEN_EXPIRATION },
		);
	}

	async getTokens(userId: number, username: string) {
		const [accessToken, refreshToken] = await Promise.all([
			this.createAccessToken(userId, username),
			this.createRefreshToken(userId, username),
		]);
		return { accessToken, refreshToken };
	}

	async updateRefreshTokenHash(userId: number, refreshToken: string) {
		const refreshTokenHash = await this.hashData(refreshToken);
		await this.userService.updateRefreshTokenHash(userId, refreshTokenHash);
	}

	async signUpLocal(dto: SignUpLocalDto): Promise<Tokens> {
		const passwordHash = await this.hashData(dto.password);
		const newUser = await this.userService.createUser(
			dto.email,
			dto.username,
			passwordHash,
		);

		const tokens = await this.getTokens(newUser.id, newUser.username);
		await this.updateRefreshTokenHash(newUser.id, tokens.refreshToken);
		return tokens;
	}

	async signinLocal(dto: SignInLocalDto): Promise<Tokens> {
		const user = await this.userService.findOneByUsername(dto.username);

		if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
			throw new UnauthorizedException("Invalid credentials");
		}

		const tokens = await this.getTokens(user.id, user.username);
		await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
		return tokens;
	}

	async logoutLocal(userId: number) {
		await this.userService.updateRefreshTokenHash(userId, null);
	}

	async refreshTokens(userID: number, rt: string): Promise<Tokens> {
		const user = await this.userService.findOneById(userID);

		if (!user || !user.refreshTokenHash) {
			throw new UnauthorizedException("Invalid credentials");
		}

		const rtMatches = await bcrypt.compare(rt, user.refreshTokenHash);
		if (!rtMatches) throw new UnauthorizedException("Invalid credentials");

		const tokens = await this.getTokens(user.id, user.username);
		await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
		return tokens;
	}
}
