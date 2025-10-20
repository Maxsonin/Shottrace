import {
	CallHandler,
	ExecutionContext,
	Injectable,
	InternalServerErrorException,
	NestInterceptor,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { from, Observable } from "rxjs";
import { switchMap } from "rxjs/operators";

@Injectable()
export class ResponseValidationInterceptor<T extends object>
	implements NestInterceptor<any, T>
{
	constructor(private readonly dto: new () => T) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
		return next.handle().pipe(
			switchMap((data) =>
				from(
					(async () => {
						if (!data) return data;

						const transformed = plainToInstance(this.dto, data, {
							enableImplicitConversion: true, // convert types
							exposeDefaultValues: true, // use default values
						});

						const errors = await validate(transformed, {
							whitelist: true, // remove unknown props
						});

						if (errors.length > 0) {
							console.error("Response validation failed", errors);
							throw new InternalServerErrorException({
								message: "Response validation failed",
							});
						}

						return transformed;
					})(),
				),
			),
		);
	}
}
