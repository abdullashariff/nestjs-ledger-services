import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   const config = new DocumentBuilder()
    .setTitle('Ledger example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,     // Strips away data that isn't in the DTO
    forbidNonWhitelisted: true, // Throws error if extra data is sent
    transform: true,     // Automatically transforms payloads to DTO instances
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
