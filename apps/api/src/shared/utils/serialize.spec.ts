import 'reflect-metadata';
import { Expose, Type } from 'class-transformer';
import { serialize } from './serialize.util';

class ChildDto {
  @Expose()
  id: string;

  @Expose()
  stringValue: string;

  @Expose()
  numberValue: number;
}

class SimpleDto {
  @Expose()
  name: string;

  @Expose()
  age: number;
}

class ParentDto {
  @Expose()
  id: string;

  @Expose()
  active: boolean;

  @Expose()
  @Type(() => SimpleDto)
  simple: SimpleDto;

  @Expose()
  scores: number[];

  @Expose()
  @Type(() => ChildDto)
  children: ChildDto[];

  @Expose()
  tagline?: string;
}

const valid: ParentDto = {
  id: '1',
  active: true,
  simple: { name: 'John', age: 30 },
  scores: [1, 2, 3],
  children: [
    { id: 'c1', stringValue: 'a', numberValue: 10 },
    { id: 'c2', stringValue: 'b', numberValue: 20 },
  ],
};

describe('serialize', () => {
  it('keeps valid values', () => {
    const result = serialize(ParentDto, valid);

    expect(result.id).toBe('1');
    expect(result.simple.name).toBe('John');
    expect(result.scores).toEqual([1, 2, 3]);
    expect(result.children).toHaveLength(2);
    expect(result.children[1]!.numberValue).toBe(20);
  });

  it('strips fields not marked @Expose(), including nested', () => {
    const dirty = {
      ...valid,
      extraField: 'should be removed',
      simple: { name: 'John', age: 30, secret: 'x' },
      children: [{ id: 'c1', stringValue: 'a', numberValue: 1, leak: true }],
    } as unknown as ParentDto;

    const result = serialize(ParentDto, dirty);

    expect((result as any).extraField).toBeUndefined();
    expect((result.simple as any).secret).toBeUndefined();
    expect((result.children[0] as any).leak).toBeUndefined();
  });

  it('leaves optional fields undefined when absent', () => {
    const result = serialize(ParentDto, valid);

    expect(result.tagline).toBeUndefined();
  });

  it('never throws — it shapes, it does not validate', () => {
    const malformed = { ...valid, scores: ['nope'] } as unknown as ParentDto;

    expect(() => serialize(ParentDto, malformed)).not.toThrow();
  });
});
