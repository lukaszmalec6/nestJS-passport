import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {join} from 'path';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // app.useStaticAssets(join(__dirname, '..', 'public'));

  const options = new DocumentBuilder()
    .setTitle('Express delivery')
    .setDescription('Ultra backend api docs')
    .setVersion('1.0')
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, options));

  await app.listen(3000);
}
bootstrap();
