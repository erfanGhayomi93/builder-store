import 'reflect-metadata';
import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
config({ path: 'apps/api/.env' });
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.enableCors({
    origin: (
      process.env.CORS_ORIGINS ??
      'http://localhost:3100,http://localhost:4200,http://localhost:4300'
    ).split(','),
  });
  app.enableShutdownHooks();
  await app.listen(Number(process.env.PORT ?? 3101), '127.0.0.1');
}
void bootstrap();
