import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import {
	REFRESH_TOKEN_COOKIE,
	REFRESH_TOKEN_SECRET,
} from "../constants/constants";
import { AuthUser, JwtPayload } from "../types/auth.type";

const cookieExtractor = (req: Request): string | null => {
	return req?.cookies?.[REFRESH_TOKEN_COOKIE] || null;
};

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
	Strategy,
	"jwt-refresh",
) {
	constructor() {
		super({
			jwtFromRequest: cookieExtractor,
			secretOrKey: REFRESH_TOKEN_SECRET,
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: JwtPayload): Promise<AuthUser> {
		const refreshToken = cookieExtractor(req);
		return {
			userId: Number(payload.sub),
			username: payload.username,
			refreshToken,
		};
	}
}
