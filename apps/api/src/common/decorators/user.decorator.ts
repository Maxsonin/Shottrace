import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AuthUser } from "src/modules/auth/types/auth.type";

export const User = createParamDecorator(
	(data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();

		const user: AuthUser | null = request.user ?? null;

		if (!user) return null;

		return data ? (user[data] ?? null) : user;
	},
);
