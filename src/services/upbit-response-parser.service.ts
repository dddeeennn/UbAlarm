import { Logger } from './logger.service';

export class UpbitResponseParser {
    private logger: Logger;

    constructor() {
        this.logger = new Logger();
    }

    public parse(response: any): any {
        this.logger.info(`Response is ${response}`);
    }
}