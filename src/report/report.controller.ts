import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('reports')
@Controller('report')
export class ReportController {
  @Get()
  @ApiOperation({ summary: 'Get all reports' })
  @ApiResponse({ status: 200, description: 'Returns all available reports' })
  async getAllReports() {
    return [];
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generate a new report' })
  @ApiResponse({ status: 201, description: 'Report generated successfully' })
  async generateReport(@Body() body: any) {
    return { message: 'Report generation started' };
  }
} 