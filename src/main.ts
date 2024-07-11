import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { logger } from './middlewares/logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(logger)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
   }),  
  );
  const config = new DocumentBuilder()
  .setTitle('AquaMaris Back')
  .setDescription('This is the api for aquamaris, a hotel in Colombia')
  .setVersion('1.0')
  .addTag('AQUAMARIS')
  .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(3001);
}
bootstrap();
