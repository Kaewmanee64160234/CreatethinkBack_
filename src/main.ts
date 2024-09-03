import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //add enable cors
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(bodyParser.json({ limit: '1gb' }));
  app.use(bodyParser.urlencoded({ limit: '1gb', extended: true }));
  const config = new DocumentBuilder()
    .setTitle('Informatic Attendance ')
    .setDescription('The Informatic Attendance API description')
    .setVersion('1.0')
    .addTag('Informatic Attendance')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
