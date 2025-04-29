export interface ButtonConfig {
  selector: string;
  clickCount: number;
  waitAfterClick?: number; // milliseconds to wait after each click
  searchText?: string;  // Optional text to search within elements
}

export interface ReportConfig {
  url: string;
  buttons: ButtonConfig[]; // Sequence of buttons to click
  graphSelector: string;
  name?: string;  // Company/Project name to search for
  period?: 'D' | 'M' | 'W'; // Time period for the report
  delay?: number; // Delay in milliseconds before taking screenshot
  viewport?: {
    width: number;
    height: number;
  };
}

const DEFAULT_NAME = 'at  ADNOC';
const DEFAULT_PERIOD = 'D';

export const defaultConfig: ReportConfig = {
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
  delay: 10000, // 10 seconds delay
  viewport: {
    width: 3440,
    height: 1440
  }
};

export const reportConfigs: ReportConfig[] = [
  {
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
    delay: 10000, // 10 seconds delay
    viewport: {
      width: 3440,
      height: 1440
    }
  }
]; 