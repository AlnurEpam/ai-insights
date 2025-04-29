import { Module } from '@nestjs/common';
import { ReportModule } from './report/report.module';
import { BrowserModule } from './browser/browser.module';
import { ExternalModule } from './external/external.module';

@Module({
  imports: [
    ReportModule,
    BrowserModule,
    ExternalModule,
  ],
})
export class AppModule {} 