import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ACCESS_TOKEN_SECRET } from "../constants/constants";
import { AuthUser, JwtPayload } from "../types/auth.type";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: ACCESS_TOKEN_SECRET,
			ignoreExpiration: false,
		});
	}

	async validate(payload: JwtPayload): Promise<AuthUser> {
		return {
			userId: Number(payload.sub),
			username: payload.username,
			refreshToken: null,
		};
	}
}
