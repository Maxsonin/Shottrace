import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ClassConstructor } from 'class-transformer';

/**
 * sync DTO validation + transformation utility.
 *
 * - Every field must use `@Expose()`
 * - Always validate primitives explicitly
 * - Nested objects must use: `@ValidateNested()` with `@Type(() => Class)`
 * - Arrays must use: `@IsArray()`, `@Type(() => PrimitiveType)` with `@IsPrimitiveType({ each: true })`
 * - Nested Arrays must use: `@IsArray()`, `@Type(() => Class)` with `@ValidateNested({ each: true })`
 * - `IsDefined()` is not required, as `@IsType` and `@Type(() => Class)` will throw error on `undefined`
 */
export function toResponse<T>(
  dtoClass: ClassConstructor<T>,
  plain: unknown,
): T {
  const instance = plainToInstance(dtoClass, plain, {
    enableImplicitConversion: true, // Convert primitive values based on reflected TypeScript types
    excludeExtraneousValues: true, // Keep only properties decorated with @Expose()
  });

  const errors = validateSync(instance as object, {
    skipMissingProperties: false, // Throw an error if a required property is missing
  });

  if (errors.length > 0) {
    throw new Error(
      `Invalid Response DTO:\n${JSON.stringify(errors, null, 2)}`,
    );
  }

  return instance as T;
}
