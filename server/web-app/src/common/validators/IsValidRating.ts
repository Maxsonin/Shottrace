import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsValidRating(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsValidRating',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          const allowed = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0];
          return (
            typeof value === 'number' &&
            allowed.includes(Number(value.toFixed(1)))
          );
        },
        defaultMessage: () =>
          'Rating must be one of the following values: 0.5, 1.0, 1.5, ..., 5.0',
      },
    });
  };
}
