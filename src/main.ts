import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { FileMiddleware } from './middleware/file.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {cors: true});
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
    methods: 'GET,PUT,POST',
    allowedHeaders: 'Content-Type,Authorization',
    exposedHeaders: 'Content-Range,X-Content-Range',
    credentials: true,
    maxAge: 3600,
  })
  app.useStaticAssets('dist/public', {
    prefix: '/static',
  })
  // app.useStaticAssets('src/public', {
  //   prefix: '/static',
  // })
  // app.use(new FileMiddleware().use)
  await app.listen(3000)
}
bootstrap()
