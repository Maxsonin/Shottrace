import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { setupApp } from "./bootstrap";
import { setupSwagger } from "./core/config/swagger.config";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	const port = configService.get<number>("server.port")!;
	const globalPrefix = configService.get<string>("api.globalPrefix")!;
	const frontendOrigin = configService.get<string>("cors.origin")!;

	setupApp(app, { globalPrefix, frontendOrigin });
	setupSwagger(app);

	await app.listen(port);
}
bootstrap();
