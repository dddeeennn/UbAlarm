import { UpbitBrowser } from './services/upbit-browser.service';
import { Logger } from './services/logger.service';

try {
    Logger.info('Sarting service...')
    const browser = new UpbitBrowser();
    browser.doWork();
} catch (e) {
    Logger.error(`Unexpected error happened: ${e}`);
}
