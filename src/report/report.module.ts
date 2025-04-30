import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { SharedModule } from '../shared/shared.module';
import { ExternalModule } from '../external/external.module';

@Module({
  imports: [SharedModule, ExternalModule],
  controllers: [ReportController],
})
export class ReportModule {} 