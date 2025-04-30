export interface ButtonConfig {
  selector: string;
  clickCount: number;
  waitAfterClick?: number; // milliseconds to wait after each click
  searchText?: string;  // Optional text to search within elements
}

export interface BrowserConfig {
  url: string;
  viewport: {
    width: number;
    height: number;
  };
  buttons: Array<{
    selector: string;
    searchText?: string;
    clickCount?: number;
    waitAfterClick?: number;
  }>;
  graphSelector: string;
  delay?: number;
  name?: string;
  period?: 'D' | 'M' | 'W';
}

const DEFAULT_NAME = 'at  ADNOC';
const DEFAULT_PERIOD = 'D';

export const browserConfig: BrowserConfig = {
  url: 'http://localhost:3000/dashboard',
  name: DEFAULT_NAME,
  period: DEFAULT_PERIOD,
  buttons: [
    {
      selector: 'button[aria-label="AI Insights"]',
      clickCount: 3,
      waitAfterClick: 1000
    },
    {
      selector: '.group-title-wrap',
      clickCount: 1,
      waitAfterClick: 1000
    },
    {
      selector: `[id="${DEFAULT_NAME}"]`,
      clickCount: 1,
      waitAfterClick: 1000
    },
    {
      selector: '[class^="StyledCTAButton"]',
      clickCount: 1,
      waitAfterClick: 1000
    },
    {
      selector: 'button[class*="StyledChartDateRangeBtn"]',
      searchText: DEFAULT_PERIOD,
      clickCount: 1,
      waitAfterClick: 1000
    }
  ],
  graphSelector: '.recharts-wrapper',
  delay: 2000, // 2 seconds delay
  viewport: {
    width: 3440,
    height: 1440
  }
}; 