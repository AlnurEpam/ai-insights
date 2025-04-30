import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { PlaywrightService } from '../shared/playwright.service';
import { ExternalService } from '../external/external.service';
import { reportConfigs } from '../config/report-config';

@ApiTags('reports')
@Controller('report')
export class ReportController {
  constructor(
    private readonly playwrightService: PlaywrightService,
    private readonly externalService: ExternalService,
  ) {}

  @Get(':type')
  @ApiOperation({ summary: 'Generate a report by type' })
  @ApiResponse({ status: 200, description: 'Returns the generated PDF report' })
  async generateReport(@Param('type') type: string, @Res() res: Response) {
    const config = reportConfigs[type];
    if (!config) {
      throw new Error(`Report type ${type} not found`);
    }

    // 1. Get PDF from the site
    const sitePdf = await this.playwrightService.generatePdfFromSite(config);

    // 2. Get additional data from external API
    const extraData = await this.externalService.fetchData(type);

    // 3. For now, return the site PDF directly
    // TODO: Implement PDF merging with external data
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${type}-report.pdf"`,
    });
    res.send(sitePdf);
  }
} 