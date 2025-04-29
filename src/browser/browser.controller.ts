import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { PlaywrightService } from './playwright.service';
import { ReportConfig, defaultConfig } from '../config/report-config';
import { ApiOperation, ApiBody, ApiResponse, ApiTags, ApiProperty } from '@nestjs/swagger';

class ScreenshotRequestDto {
  @ApiProperty({
    description: 'Company/Project name to search for',
    required: false,
    example: 'at  ADNOC'
  })
  name?: string;

  @ApiProperty({
    description: 'Time period for the report',
    enum: ['D', 'M', 'W'],
    example: 'M',
    required: false
  })
  period?: 'D' | 'M' | 'W';
}

@ApiTags('Browser')
@Controller('browser')
export class BrowserController {
  constructor(private readonly playwrightService: PlaywrightService) {}

  @Post('screenshot')
  @ApiOperation({ summary: 'Take a screenshot of the graph' })
  @ApiBody({
    type: ScreenshotRequestDto,
    description: 'Request parameters for screenshot',
    examples: {
      example1: {
        value: { name: 'at  ADNOC', period: 'M' },
        description: 'Example with ADNOC and monthly period'
      },
      example2: {
        value: { name: 'at  ADNOC Onshore', period: 'W' },
        description: 'Example with ADNOC Onshore and weekly period'
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Returns PNG image of the graph',
    content: {
      'image/png': {
        schema: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: 'Error occurred while taking screenshot'
  })
  async takeScreenshot(@Body() body: ScreenshotRequestDto, @Res() res: Response) {
    // Create a new config based on defaultConfig but with the name and period from body
    const config: ReportConfig = {
      ...defaultConfig,
      name: body.name || defaultConfig.name,
      period: body.period || defaultConfig.period,
      buttons: defaultConfig.buttons.map(button => {
        // Update the selector for the element with id if name is provided
        if (button.selector.includes('id=')) {
          return {
            ...button,
            selector: `[id="${body.name || defaultConfig.name}"]`
          };
        }
        // Update the searchText for period button if period is provided
        if (button.selector.includes('StyledChartDateRangeBtn')) {
          return {
            ...button,
            searchText: body.period || defaultConfig.period
          };
        }
        return button;
      })
    };

    const browser = await this.playwrightService.launchBrowser();
    const page = await browser.newPage({
      viewport: config.viewport || { width: 1920, height: 1080 }
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
      
      const screenshot = await graphElement.screenshot();
      
      res.setHeader('Content-Type', 'image/png');
      res.send(screenshot);
    } catch (error) {
      res.status(500).json({ error: error.message });
    } finally {
      await browser.close();
    }
  }
} 