import { Module } from '@nestjs/common';
import { HhService } from './gitnode.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [HhService],
  imports: [ConfigModule, HttpModule],
  exports: [HhService]
})
export class HhModule {}
