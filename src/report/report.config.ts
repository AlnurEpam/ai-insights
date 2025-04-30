export interface ReportConfig {
  url: string;
  viewport: {
    width: number;
    height: number;
  };
  buttons?: Array<{
    selector: string;
    searchText?: string;
    clickCount?: number;
    waitAfterClick?: number;
  }>;
  graphSelector?: string;
  delay?: number;
  externalApi?: string;
}

export const reportConfigs: Record<string, ReportConfig> = {
  sales: {
    url: 'https://example.com/sales',
    viewport: { width: 1280, height: 720 },
  },
  finance: {
    url: 'https://example.com/finance',
    viewport: { width: 1280, height: 720 },
  },
}; 