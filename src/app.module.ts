import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GenerateController } from './generate/generate.controller';
import { GenerateModule } from './generate/generate.module';
import { ConfigModule } from '@nestjs/config';
import { CatController } from './cat/cat.controller';

@Module({
  imports: [GenerateModule, ConfigModule.forRoot({ 
    isGlobal: true,
    envFilePath: ['config/.env.dev'], 
  })],
  controllers: [AppController, CatController],
  providers: [AppService],
})
export class AppModule{}
