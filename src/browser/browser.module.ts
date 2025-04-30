import { Module } from '@nestjs/common';
import { BrowserController } from './browser.controller';
import { BrowserService } from './browser.service';
import { PlaywrightService } from '../shared/playwright.service';

@Module({
  controllers: [BrowserController],
  providers: [BrowserService, PlaywrightService],
  exports: [BrowserService]
})
export class BrowserModule {} 