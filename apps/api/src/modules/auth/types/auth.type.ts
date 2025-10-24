export type Tokens = {
	accessToken: string;
	refreshToken: string;
};

export type JwtPayload = {
	sub: string;
	username: string;
};

export type AuthUser = {
	userId: number;
	username: string;
	refreshToken: string | null;
};
