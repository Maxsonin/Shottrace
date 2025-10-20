import {
	IsEmail,
	IsNotEmpty,
	IsString,
	Length,
	Matches,
} from "class-validator";

export class SignInLocalDto {
	@IsString()
	@Length(3, 25, { message: "Username must be between 3 and 25 characters" })
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}

export class SignUpLocalDto {
	@IsEmail({}, { message: "Email must be valid" })
	@IsNotEmpty()
	email: string;

	@IsString()
	@Length(3, 25, { message: "Username must be between 3 and 25 characters" })
	@IsNotEmpty()
	@Matches(/^(?:\p{Script=Latin}|\d|\p{S}|\u200D|\uFE0F|[ _])+$/u, {
		message: "Only Latin letters, numbers, emojis, and spaces are allowed",
	})
	username: string;

	@IsNotEmpty()
	@IsString()
	@Length(8, 128, { message: "Password must be at least 8 characters" })
	password: string;
}
