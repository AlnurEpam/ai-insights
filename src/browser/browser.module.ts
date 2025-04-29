import { Module } from '@nestjs/common';
import { PlaywrightService } from './playwright.service';
import { BrowserController } from './browser.controller';

@Module({
  controllers: [BrowserController],
  providers: [PlaywrightService],
  exports: [PlaywrightService],
})
export class BrowserModule {} 