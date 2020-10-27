import puppeteer from 'puppeteer';

import { safeLaunchOptions } from '@fluentui/scripts/puppeteer/puppeteer.config';
import { E2EApi } from './e2eApi';

jest.setTimeout(30000);

let browser: puppeteer.Browser;
let page: puppeteer.Page;
let consoleErrors: string[] = [];

const launchOptions: puppeteer.LaunchOptions = safeLaunchOptions({
  headless: true,
  dumpio: false,
  slowMo: 0,
});

beforeAll(async () => {
  browser = await puppeteer.launch(launchOptions);
});

beforeEach(async () => {
  page = await browser.newPage();

  // setup console errors detection
  consoleErrors = [];
  page.on('console', message => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  global['e2e'] = new E2EApi(page);
});

afterEach(async () => {
  await page.close();
  expect(consoleErrors).toEqual([]);

  global['e2e'] = null;
});

afterAll(async () => {
  // Sometimes in CI this is undefined, not sure how
  if (browser) {
    await browser.close();
  }
});
