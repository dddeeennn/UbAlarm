import { Logger } from './logger.service';
import { UpbitEventPublisher } from './upbit-event-publisher.service';
import { ApiResponseModel } from '../models/api-response.model';
import { AlarmNotifierService } from './notifiers/alarm-notifier.service';
import { TelegramNotifierService } from './notifiers/telegram-notifier.service';
const https = require('https');
const request = require('request');
var Config = require('./../config.json');
var StubApiResponse = require('../tests/api-response-stub.json');

export class UpbitBrowser {
    private interval: NodeJS.Timer;
    private eventPublisher: UpbitEventPublisher;
    private logger: Logger;

    constructor() {
        this.eventPublisher = new UpbitEventPublisher();
        this.logger = new Logger();
    }

    public doWork() {
        this.initialize();
        this.handleInterval(); // start immediately
        this.interval = setInterval(() => this.handleInterval(), Config.refreshIntervalSec * 1000)
    }

    private handleInterval(): void {
        try {
            this.logger.info('Regular job is starting...');

            this.requestUpbit()
                .then((response) => this.eventPublisher.handleResponse(response))
                .catch(e => {
                    this.logger.error(`Exception occured: ${e}`);
                });
        }
        catch (e) {
            this.logger.error(`Unexpected exception occured: ${e}`);
            clearInterval(this.interval);
            throw e;
        }
    }

    private requestUpbit(): Promise<ApiResponseModel> {
        const url = Config.upbitUrl.replace('{key}', Config.keyWord);
        return new Promise<ApiResponseModel>((resolve, reject) => {
            this.logger.info(`Fetch ${url}`);
            request(
                {
                    'url': url,
                    'proxy': Config.proxyUrl
                },
                (error, response, body) => {
                    if (!error && response.statusCode == 200) {
                        this.logger.info('Fetch was succesed.');

                        if (Config.test) {
                            resolve(StubApiResponse);
                        }
                        resolve(JSON.parse(body));
                    }
                    else {
                        if (!response || !response.statusCode) return;

                        this.logger.error(`When request ${url} error happened: ${response.statusCode};`);
                        reject(response.statusCode);
                    }
                }
            );
        });
    }

    private initialize(): void {
        this.logger.info(`Current setting is ${JSON.stringify(Config)}.`);
        this.eventPublisher.addSubscriber(new AlarmNotifierService());
        this.eventPublisher.addSubscriber(new TelegramNotifierService());
    }
}
