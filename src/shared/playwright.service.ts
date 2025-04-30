import { Injectable } from '@nestjs/common';
import { chromium, Browser, Page } from 'playwright';
import { ReportConfig } from '../report/report.config';

@Injectable()
export class PlaywrightService {
  async launchBrowser(): Promise<Browser> {
    return await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async generatePdfFromSite(config: ReportConfig): Promise<Buffer> {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    try {
      console.log(`Navigating to URL: ${config.url}`);
      await page.goto(config.url, { waitUntil: 'networkidle' });
      
      // Click all required buttons if they exist
      if (config.buttons) {
        for (const button of config.buttons) {
          console.log(`Attempting to click button with selector: ${button.selector}`);
          await this.clickButton(page, button);
        }
      }

      // Wait for graph if selector is provided
      if (config.graphSelector) {
        console.log(`Waiting for graph selector: ${config.graphSelector}`);
        await page.waitForSelector(config.graphSelector, { timeout: 30000 });
      }

      // Generate PDF with header and footer
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '60px', bottom: '60px', left: '40px', right: '40px' },
        displayHeaderFooter: true,
        headerTemplate: '<span style="font-size:10px;">Report Header</span>',
        footerTemplate: '<span style="font-size:10px;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>',
      });

      return pdfBuffer;
    } catch (error) {
      console.error('Error in generatePdfFromSite:', error);
      throw error;
    } finally {
      await browser.close();
    }
  }

  async clickButton(page: Page, button: { selector: string; searchText?: string; clickCount?: number; waitAfterClick?: number }): Promise<void> {
    try {
      // If we need to search by text content
      if (button.searchText) {
        console.log(`Searching for element containing text: ${button.searchText}`);
        
        // Wait for any element matching the selector
        await page.waitForSelector(button.selector, {
          state: 'attached',
          timeout: 10000
        });

        // Find element containing the specific text
        const elements = await page.$$(button.selector);
        for (const element of elements) {
          const text = await element.textContent();
          if (text && text.includes(button.searchText)) {
            console.log(`Found element with matching text: ${button.searchText}`);
            // Click the element specified number of times
            for (let i = 0; i < (button.clickCount || 1); i++) {
              await element.click();
              if (button.waitAfterClick) {
                await new Promise(resolve => setTimeout(resolve, button.waitAfterClick));
              }
            }
            return;
          }
        }
        throw new Error(`No element found containing text: ${button.searchText}`);
      }

      // Regular button click without text search
      await page.waitForSelector(button.selector, {
        state: 'visible',
        timeout: 10000
      });

      // Click the button specified number of times
      for (let i = 0; i < (button.clickCount || 1); i++) {
        console.log(`Clicking button (${i + 1}/${button.clickCount || 1})`);
        await page.click(button.selector, { timeout: 5000 });
        
        if (button.waitAfterClick) {
          console.log(`Waiting ${button.waitAfterClick}ms after click`);
          await new Promise(resolve => setTimeout(resolve, button.waitAfterClick));
        }
      }
    } catch (error) {
      console.error(`Error clicking button with selector "${button.selector}":`, error);
      throw error;
    }
  }
} 