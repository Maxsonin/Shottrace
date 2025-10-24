import { ClassConstructor, plainToInstance } from "class-transformer";

const DEFAULT_OPTIONS = {
	excludeExtraneousValues: true,
	enableImplicitConversion: true,
};

export function toDto<T, V>(
	dtoClass: ClassConstructor<T>,
	plain: V,
	options?: Parameters<typeof plainToInstance>[2],
): T {
	return plainToInstance(dtoClass, plain, {
		...DEFAULT_OPTIONS,
		...options,
	});
}
