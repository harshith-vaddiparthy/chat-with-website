declare module '@mendable/firecrawl-js' {
  export interface CrawlResponse {
    success: boolean;
    id?: string;
    url?: string;
    error?: string;
  }

  export interface ScrapeResponse {
    success: boolean;
    error?: string;
    data?: {
      markdown?: string;
      html?: string;
      metadata?: {
        title?: string;
        description?: string;
        language?: string;
        sourceURL?: string;
        [key: string]: any;
      };
    };
  }

  export interface CrawlOptions {
    limit?: number;
    scrapeOptions?: {
      formats?: ('markdown' | 'html')[];
    };
  }

  export interface ScrapeOptions {
    formats?: ('markdown' | 'html')[];
    actions?: Array<{
      type: string;
      milliseconds?: number;
      selector?: string;
      text?: string;
      key?: string;
    }>;
  }

  export default class FirecrawlApp {
    constructor(config: { apiKey: string });
    crawlUrl(url: string, options?: CrawlOptions): Promise<CrawlResponse>;
    checkCrawlStatus(crawlId: string): Promise<ScrapeResponse>;
    scrapeUrl(url: string, options?: ScrapeOptions): Promise<ScrapeResponse>;
  }
} 