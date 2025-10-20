import { z } from "zod";

const envSchema = z.object({
	API_GLOBAL_PREFIX: z.string().default("api"),

	PORT: z
		.string()
		.default("3000")
		.transform((val) => parseInt(val, 10)),
	FRONTEND_ORIGIN: z.string().default("http://localhost:5173"),

	DATABASE_URL: z.string(),
});

const parsedEnv = envSchema.parse(process.env);

const envConfig = () => ({
	api: { globalPrefix: parsedEnv.API_GLOBAL_PREFIX },
	server: { port: parsedEnv.PORT },
	cors: { origin: parsedEnv.FRONTEND_ORIGIN },
	database: { url: parsedEnv.DATABASE_URL },
	redis: { host: process.env.REDIS_HOST, port: process.env.REDIS_PORT },
});

export default envConfig;
