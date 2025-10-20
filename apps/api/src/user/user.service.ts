import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async createUser(
		email: string,
		username: string,
		passwordHash: string,
	): Promise<User> {
		return await this.prisma.user.create({
			data: {
				email,
				username,
				passwordHash,
			},
		});
	}

	async findOneById(id: number): Promise<User | null> {
		return await this.prisma.user.findUnique({ where: { id } });
	}
	async findOneByUsername(username: string): Promise<User | null> {
		return await this.prisma.user.findUnique({ where: { username } });
	}
	async findOneByEmail(email: string): Promise<User | null> {
		return await this.prisma.user.findUnique({ where: { email } });
	}

	async updateRefreshTokenHash(
		userId: number,
		refreshTokenHash: string | null,
	): Promise<User> {
		return await this.prisma.user.update({
			where: { id: userId },
			data: { refreshTokenHash },
		});
	}
}
