import { registerDecorator, ValidationOptions } from "class-validator";

const ALLOWED_RATINGS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export function IsValidRating(validationOptions?: ValidationOptions) {
	return (object: Object, propertyName: string) => {
		registerDecorator({
			name: "IsValidRating",
			target: object.constructor,
			propertyName,
			options: validationOptions,
			validator: {
				validate(value: any) {
					if (typeof value !== "number") return false; // ensures number

					return ALLOWED_RATINGS.includes(value);
				},
				defaultMessage() {
					return `Rating must be one of: ${ALLOWED_RATINGS.join(", ")}`;
				},
			},
		});
	};
}
