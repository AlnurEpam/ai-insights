import { Injectable } from '@nestjs/common';
import { PlaywrightService } from '../browser/playwright.service';
import { ExternalService } from '../external/external.service';
import { reportConfigs } from '../config/report-config';

@Injectable()
export class ReportService {
  constructor(
    private readonly playwrightService: PlaywrightService,
    private readonly externalService: ExternalService,
  ) {}

  async generateFullReport(type: string): Promise<Buffer> {
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
    return sitePdf;
  }
} 