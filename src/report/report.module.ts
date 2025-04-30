import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { PlaywrightService } from '../shared/playwright.service';
import { BrowserModule } from '../browser/browser.module';

@Module({
  imports: [BrowserModule],
  controllers: [ReportController],
  providers: [PlaywrightService],
})
export class ReportModule {} 