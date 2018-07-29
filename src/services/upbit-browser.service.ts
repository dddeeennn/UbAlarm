import { UpbitResponseParser } from './upbit-response-parser.service';
import { Logger } from './logger.service';
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var Config = require('./../config.json');

export class UpbitBrowser {
    private interval: NodeJS.Timer;
    private requests: XMLHttpRequest[];
    private parser: UpbitResponseParser;
    private logger: Logger;
    private throttlingCounter = 0;
    private throttlingThreashold = 30;

    constructor() {
        this.parser = new UpbitResponseParser();
        this.logger = new Logger();
        this.requests = [];
    }

    public doWork() {

        this.logger.info(`Current setting is ${JSON.stringify(Config)}.`);
        this.handleInterval(); // start immediately
        this.interval = setInterval(() => this.handleInterval(), Config.refreshIntervalSec * 1000)
    }

    private handleInterval(): void {
        try {
            this.logger.info('Regular job is starting...');

            if (this.throttlingCounter > this.throttlingThreashold)
                throw 'Cannot get any response from upbit API! Please investiate the problem soon as possible!';

            const uncompletedRequests = this.requests.filter(request => request.status < 200);
            if (uncompletedRequests > Config.maxConcurrentRequests) {
                this.logger.warn('Skiping request... Number of concurrent uncompleted requests exceed the threashold = ' + Config.maxConcurrentRequests);
                this.throttlingCounter++;
                return;
            }

            this.requestUpbit()
                .then(() => this.throttlingCounter = 0)
                .then(this.parser.parse)
                .catch(e => {
                    this.logger.error(`Exception occured: ${e}`);
                });
        }
        catch (e) {
            this.logger.error(`Unexpected exception occured: ${e}`);
            clearInterval(this.interval);
            this.requests.forEach((request: XMLHttpRequest) => {
                request.abort();
            })
            throw e;
        }
    }

    private requestUpbit(): Promise<any> {
        const url = Config.upbitUrl.replace('{key}', Config.keyWord);

        return new Promise<any>((resolve, reject) => {
            const request = new XMLHttpRequest();

            request.open('GET', url);
            request.timeout = Config.requestsTimeoutSec;
            request.addEventListener('load', evt => {
                this.logger.info('Fetch was succesed.')
                resolve(request.responseText);
            });
            request.addEventListener('error', () => {
                this.logger.error(`When request ${url} error happened: ${request.responseText};`);
                reject(request.responseText);
            });
            request.addEventListener('timeout', (evt) => {
                this.logger.error(`Request ${url} fails with timeout...`);
                reject(evt);
            })
            request.addEventListener('abort', evt => {
                this.logger.error(`Request ${url} was aborted.`);
                reject(evt);
            })
            this.requests.push(request);
            this.logger.info(`Fetch ${url}`);
            request.send();
        });
    }
}