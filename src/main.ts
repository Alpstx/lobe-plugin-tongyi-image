import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as fs from 'fs';

const httpsOptions = {
  ca: fs.readFileSync('/www/ssl/aerbu2.top_chain.crt'),
  key: fs.readFileSync('/www/ssl/aerbu2.top.key'),
  cert: fs.readFileSync('/www/ssl/aerbu2.top_public.crt'),
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
    httpsOptions
  });
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
    methods: 'GET,PUT,POST,FETCH',
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
  await app.listen(13456)
}
bootstrap()
