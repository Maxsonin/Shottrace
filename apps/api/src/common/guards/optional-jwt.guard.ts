import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("jwt") {
	async canActivate(context: ExecutionContext) {
		try {
			(await super.canActivate(context)) as boolean;
		} catch (err) {
			// Ignore errors if no token or invalid token
		}

		return true; // always allow the request
	}

	handleRequest(err: any, user: any) {
		// Return user if present, otherwise null
		return user ?? null;
	}
}
