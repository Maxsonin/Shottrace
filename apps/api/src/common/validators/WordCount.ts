import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
} from "class-validator";

export function WordCount(
	min: number,
	max: number,
	validationOptions?: ValidationOptions,
) {
	return (object: Object, propertyName: string) => {
		registerDecorator({
			name: "WordCount",
			target: object.constructor,
			propertyName: propertyName,
			constraints: [min, max],
			options: validationOptions,
			validator: {
				validate(value: any, args: ValidationArguments) {
					if (typeof value !== "string") return false;

					const wordCount = value.trim().split(/\s+/).length;
					const [min, max] = args.constraints;
					return wordCount >= min && wordCount <= max;
				},
				defaultMessage(args: ValidationArguments) {
					const [min, max] = args.constraints;
					return `Content must have between ${min} and ${max} words`;
				},
			},
		});
	};
}
