import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { BrowserModule } from '../browser/browser.module';
import { ExternalModule } from '../external/external.module';

@Module({
  imports: [BrowserModule, ExternalModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {} 