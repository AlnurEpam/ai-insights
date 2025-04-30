import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
import { PlaywrightService } from '../shared/playwright.service';
import { BrowserService } from '../browser/browser.service';

@ApiTags('reports')
@Controller('report')
export class ReportController {
  constructor(
    private readonly playwrightService: PlaywrightService,
    private readonly browserService: BrowserService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Generate a report' })
  @ApiQuery({ name: 'name', required: false, description: 'Company/Project name' })
  @ApiQuery({ name: 'period', required: false, enum: ['D', 'M', 'W'], description: 'Time period' })
  @ApiResponse({ status: 200, description: 'Returns the generated PDF report' })
  async generateReport(
    @Res() res: Response,
    @Query('name') name?: string,
    @Query('period') period?: 'D' | 'M' | 'W'
  ) {
    try {
      // First get the screenshot from browser service
      const config = this.browserService.createConfig(name, period);
      const screenshot = await this.browserService.takeScreenshot(config);
      
      // Then generate PDF from the screenshot
      const pdf = await this.playwrightService.generatePdfFromSite(screenshot);
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="report.pdf"`,
      });
      res.send(pdf);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
} 