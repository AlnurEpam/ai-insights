import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { BrowserService } from './browser.service';
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
  constructor(private readonly browserService: BrowserService) {}

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
    try {
      const config = this.browserService.createConfig(body.name, body.period);
      const screenshot = await this.browserService.takeScreenshot(config);
      
      res.setHeader('Content-Type', 'image/png');
      res.send(screenshot);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
} 