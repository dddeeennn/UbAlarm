import { UpbitBrowser } from './services/upbit-browser.service';
import { Logger } from './services/logger.service';

const logger = new Logger();
try {
    logger.info('Sarting service...')
    const browser = new UpbitBrowser();
    browser.doWork();
} catch (e) {
    logger.error(`Unexpected error happened: ${e}`);
}
