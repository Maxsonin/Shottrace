import { Expose } from 'class-transformer';
import { toDto } from './to-dto.util';
import { describe, expect, it } from '@jest/globals';
import 'reflect-metadata';

class TestDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

class NumberDto {
  @Expose()
  count: number;
}

describe('toDto utility', () => {
  it('should transform plain object into DTO instance', () => {
    const plain = {
      id: '123',
      name: 'John',
      surname: 'Doe',
      password: 'secret',
    };

    const result = toDto(TestDto, plain);

    expect(result).toBeInstanceOf(TestDto);
    expect(result).toEqual({
      id: '123',
      name: 'John',
    });
  });

  it('should exclude extraneous values', () => {
    const plain = {
      id: '123',
      name: 'John',
      password: 'secret',
    };

    const result = toDto(TestDto, plain);

    expect((result as any).password).toBeUndefined();
  });

  it('should support implicit type conversion', () => {
    const plain = {
      count: '42',
    };

    const result = toDto(NumberDto, plain);

    expect(result.count).toBe(42);
    expect(typeof result.count).toBe('number');
  });
});
