import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer';

/**
 * Shapes a plain object into a response DTO instance. Check for required fields and removes extraneous values.
 *
 * Writing a DTO for it:
 *   - Mark EVERY field you want to keep with `@Expose()`;
 *   - Nested objects/arrays need `@Type(() => Class)` so they get stripped too.
 *   - Required field -> `field: T`; optional field -> `field?: T`.
 *   - No `class-validator` decorators — they belong on request DTOs only.
 */
export function serialize<T>(dtoClass: ClassConstructor<T>, plain: T): T {
  return plainToInstance(dtoClass, plain, {
    excludeExtraneousValues: true, // strips every field NOT marked `@Expose()`
  });
}
