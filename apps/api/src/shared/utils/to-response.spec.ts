import 'reflect-metadata';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { toResponse } from './to-response.util';

class ChildDto {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  stringValue: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  numberValue: number;
}

class SimpleDto {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  age: number;
}

class ParentDto {
  @Expose()
  @IsString()
  id: string;

  @Expose({ name: 'some_property' })
  @IsOptional()
  @IsNumber()
  someProperty: number;

  @Expose()
  @IsBoolean()
  active: boolean;

  @Expose()
  @Type(() => SimpleDto)
  @ValidateNested()
  simple: SimpleDto;

  @Expose()
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  scores: number[];

  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ChildDto)
  children: ChildDto[];
}

describe('toResponse', () => {
  it('should strip unknown fields', () => {
    const input = {
      id: '1',
      some_property: 10,
      active: true,
      simple: { name: 'John', age: 20, extraField: 'should be removed' },
      children: [
        {
          id: 'child-1',
          stringValue: 'hello',
          extraValue: 12345, // should be removed
        },
      ],
      extraField: 'should be removed',
    };

    const result = toResponse(ParentDto, input);

    expect((result as any).extraField).toBeUndefined();
    expect((result.children[0] as any).extraValue).toBeUndefined();
    expect((result.simple as any).extraField).toBeUndefined();
  });

  it('should convert string to number (implicit conversion)', () => {
    const input = {
      id: '1',
      some_property: '100',
      active: true,
      simple: { name: 'John', age: '20' },
      children: [
        {
          id: 'child-1',
          stringValue: 'hello',
          numberValue: '10',
        },
      ],
      scores: ['1', '2', '3'],
    };

    const result = toResponse(ParentDto, input);

    expect(typeof result.someProperty).toBe('number');
    expect(typeof result.simple.age).toBe('number');
    expect(typeof result.children[0]!.numberValue).toBe('number');
    expect(typeof result.scores[0]).toBe('number');
  });

  it('should throw on invalid conversion', () => {
    const input = {
      id: '1',
      some_property: 'not-a-number',
      active: true,
      simple: { name: 'John', age: 'not-a-number' },
      children: [
        {
          id: 'child-1',
          stringValue: 'hello',
          numberValue: 'not-a-number',
        },
      ],
      scores: ['not-a-number', '2', '3'],
    };

    const act = () => toResponse(ParentDto, input);

    expect(act).toThrow(
      'someProperty must be a number conforming to the specified constraints',
    );
    expect(act).toThrow(
      'age must be a number conforming to the specified constraints',
    );
    expect(act).toThrow(
      'numberValue must be a number conforming to the specified constraints',
    );
    expect(act).toThrow(
      'each value in scores must be a number conforming to the specified constraints',
    );
  });

  it('should handle valid DTOs', () => {
    const input = {
      id: '1',
      some_property: 100,
      active: true,
      simple: {
        name: 'John',
        age: 30,
      },
      children: [
        {
          id: 'child-1',
          stringValue: 'hello',
          numberValue: 10,
        },
      ],
    };

    const result = toResponse(ParentDto, input);

    expect(result.id).toBe('1');
    expect(result.someProperty).toBe(100);
    expect(result.active).toBe(true);
    expect(result.simple.name).toBe('John');
    expect(result.simple.age).toBe(30);
    expect(result.children[0]!.id).toBe('child-1');
    expect(result.children[0]!.numberValue).toBe(10);
  });

  it('should handle arrays correctly', () => {
    const input = {
      id: '1',
      some_property: 100,
      active: true,
      simple: {
        name: 'John',
        age: 30,
      },
      children: [
        { id: '1', stringValue: 'a', numberValue: 10 },
        { id: '2', stringValue: 'b', numberValue: 20 },
      ],
    };

    const result = toResponse(ParentDto, input);

    expect(result.children).toHaveLength(2);
  });

  it('should handle Optional fields correctly', () => {
    const input = {
      id: '1',
      some_property: 100,
      active: true,
      simple: {
        name: 'John',
      },
      children: [
        { id: '1', stringValue: 'a', numberValue: 10 },
        { id: '2', stringValue: 'b' },
      ],
    };

    const result = toResponse(ParentDto, input);

    expect(result.simple.age).toBeUndefined();
    expect(result.children[1]!.numberValue).toBeUndefined();
    expect(result.someProperty).toBe(100);
    expect(result.active).toBe(true);
    expect(result.simple.name).toBe('John');
    expect(result.children[0]!.id).toBe('1');
    expect(result.scores).toBeUndefined();
  });

  it('should throw for if required fields are missing', () => {
    const input = {
      id: '1',
      some_property: 100,
      // active: true,
      simple: {
        name: 'John',
      },
      children: [{ id: '1', stringValue: 'a', numberValue: 10 }, { id: '2' }],
    };

    const act = () => toResponse(ParentDto, input);

    expect(act).toThrow('stringValue must be a string');
    expect(act).toThrow('active must be a boolean value');
  });
});
