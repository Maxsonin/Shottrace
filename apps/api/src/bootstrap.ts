import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as cookieParser from "cookie-parser";
import { PrismaExceptionFilter } from "./common/filters/prisma-exception.filter";

interface SetupAppOptions {
	globalPrefix: string;
	frontendOrigin: string;
}

export function setupApp(app: INestApplication, options: SetupAppOptions) {
	const { globalPrefix, frontendOrigin } = options;

	// Global pipes & filters
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true, // convert plain JSON to DTO instances
			transformOptions: {
				// automatically convert types based on TypeScript types
				enableImplicitConversion: true,
			},
		}),
	);

	app.useGlobalFilters(new PrismaExceptionFilter());

	// Cookie parser
	app.use(cookieParser());

	// CORS
	app.enableCors({
		origin: frontendOrigin,
		credentials: true,
	});

	// Global prefix
	app.setGlobalPrefix(globalPrefix);
}
