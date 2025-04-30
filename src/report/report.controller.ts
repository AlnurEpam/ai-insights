import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { PlaywrightService } from '../shared/playwright.service';
import { reportConfigs } from './report.config';

@ApiTags('reports')
@Controller('report')
export class ReportController {
  constructor(
    private readonly playwrightService: PlaywrightService,
  ) {}

  @Get(':type')
  @ApiOperation({ summary: 'Generate a report by type' })
  @ApiResponse({ status: 200, description: 'Returns the generated PDF report' })
  async generateReport(@Param('type') type: string, @Res() res: Response) {
    const config = reportConfigs[type];
    if (!config) {
      throw new Error(`Report type ${type} not found`);
    }

    const pdf = await this.playwrightService.generatePdfFromSite(config);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${type}-report.pdf"`,
    });
    res.send(pdf);
  }
} 