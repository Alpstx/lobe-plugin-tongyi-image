import { Module } from '@nestjs/common';
import { GenerateController } from './generate.controller';
import { HttpModule } from '@nestjs/axios';
import { GenerateService } from './generate.service';

@Module({
  imports: [GenerateModule, HttpModule],
  controllers: [GenerateController],
  providers: [GenerateService],
})
export class GenerateModule {}
