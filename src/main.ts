import { NestFactory, NestApplication } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common/pipes';

async function bootstrap() {
  const port = process.env.PORT;

  const app = await NestFactory.create<NestApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const swaggerDocument = new DocumentBuilder()
    .setTitle('Task APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerDocument);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(
    `--------------- your application running on ${port} ---------------`,
  );
}
bootstrap();
