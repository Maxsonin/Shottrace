import { ClassConstructor, plainToInstance } from 'class-transformer';

const DEFAULT_OPTIONS = {
  enableImplicitConversion: true,
  excludeExtraneousValues: true,
};

export function toDto<T>(dtoClass: ClassConstructor<T>, plain: unknown): T {
  return plainToInstance(dtoClass, plain, DEFAULT_OPTIONS) as T;
}
