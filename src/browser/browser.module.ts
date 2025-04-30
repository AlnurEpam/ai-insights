import { Module } from '@nestjs/common';
import { BrowserController } from './browser.controller';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [BrowserController],
})
export class BrowserModule {} 