import { Injectable } from '@nestjs/common';
import { PlaywrightService } from '../shared/playwright.service';
import { BrowserConfig, browserConfig } from './browser.config';

@Injectable()
export class BrowserService {
  constructor(private readonly playwrightService: PlaywrightService) {}

  async takeScreenshot(config: BrowserConfig): Promise<Buffer> {
    const browser = await this.playwrightService.launchBrowser();
    const page = await browser.newPage({
      viewport: config.viewport
    });
    
    try {
      await page.goto(config.url, { waitUntil: 'networkidle' });
      
      // Click each button in sequence
      for (const button of config.buttons) {
        await this.playwrightService.clickButton(page, button);
      }

      // Wait for the specified delay before taking screenshot
      if (config.delay) {
        console.log(`Waiting for ${config.delay}ms before taking screenshot...`);
        await new Promise(resolve => setTimeout(resolve, config.delay));
      }

      // Wait for the graph to be visible
      console.log(`Waiting for graph selector: ${config.graphSelector}`);
      await page.waitForSelector(config.graphSelector, { timeout: 30000 });
      
      // Take screenshot of only the graph
      const graphElement = await page.$(config.graphSelector);
      if (!graphElement) {
        throw new Error(`Graph element with selector ${config.graphSelector} not found`);
      }
      
      return await graphElement.screenshot();
    } finally {
      await browser.close();
    }
  }

  createConfig(name?: string, period?: 'D' | 'M' | 'W'): BrowserConfig {
    return {
      ...browserConfig,
      name: name || browserConfig.name,
      period: period || browserConfig.period,
      buttons: browserConfig.buttons.map(button => {
        // Update the selector for the element with id if name is provided
        if (button.selector.includes('id=')) {
          return {
            ...button,
            selector: `[id="${name || browserConfig.name}"]`
          };
        }
        // Update the searchText for period button if period is provided
        if (button.selector.includes('StyledChartDateRangeBtn')) {
          return {
            ...button,
            searchText: period || browserConfig.period
          };
        }
        return button;
      })
    };
  }
} 