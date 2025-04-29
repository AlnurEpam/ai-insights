import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { reportConfigs } from '../config/report-config';

@Injectable()
export class ExternalService {
  async fetchData(reportType: string): Promise<any> {
    const config = reportConfigs[reportType];
    if (!config?.externalApi) {
      return null;
    }

    try {
      const { data } = await axios.get(config.externalApi);
      return data;
    } catch (error) {
      console.error(`Error fetching data for ${reportType}:`, error);
      return null;
    }
  }
} 