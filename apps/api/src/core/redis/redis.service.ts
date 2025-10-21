import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
	private client: Redis;

	constructor(private readonly configService: ConfigService) {}

	async onModuleInit() {
		const host = this.configService.get<string>("REDIS_HOST");
		const port = this.configService.get<number>("REDIS_PORT");

		this.client = new Redis({ host, port });

		this.client.on("connect", () =>
			console.log(`Connected to Redis at ${host}:${port}`),
		);
		this.client.on("error", (err) => console.error("Redis Error", err));
	}

	async onModuleDestroy() {
		await this.client.quit();
		console.log("Redis disconnected");
	}

	async get(key: string) {
		return this.client.get(key);
	}

	async set(key: string, value: string, ttlSeconds?: number) {
		return ttlSeconds
			? this.client.set(key, value, "EX", ttlSeconds)
			: this.client.set(key, value);
	}

	async del(key: string) {
		await this.client.del(key);
	}

	// JSON helpers
	async getJSON<T>(key: string): Promise<T | null> {
		const cached = await this.get(key);
		return cached ? JSON.parse(cached) : null;
	}

	async setJSON<T>(key: string, value: T, ttlSeconds?: number) {
		await this.set(key, JSON.stringify(value), ttlSeconds);
	}
}
