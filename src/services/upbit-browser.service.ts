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

    constructor() {
        this.eventPublisher = new UpbitEventPublisher();
    }

    public doWork() {
        this.initialize();
        this.handleInterval(); // start immediately
        this.interval = setInterval(() => this.handleInterval(), Config.refreshIntervalSec * 1000)
    }

    private handleInterval(): void {
        try {
            Logger.info('Regular job is starting...');

            this.requestUpbit()
                .then((response) => this.eventPublisher.handleResponse(response))
                .catch(e => {
                    Logger.error(`Exception occured: ${e}`);
                });
        }
        catch (e) {
            Logger.error(`Unexpected exception occured: ${e}`);
            clearInterval(this.interval);
            throw e;
        }
    }

    private requestUpbit(): Promise<ApiResponseModel> {
        const url = Config.upbitUrl.replace('{key}', Config.keyWord);
        return new Promise<ApiResponseModel>((resolve, reject) => {
            Logger.info(`Fetch ${url}`);
            request(
                {
                    'url': url,
                    'proxy': Config.proxyUrl
                },
                (error, response, body) => {
                    if (!error && response.statusCode == 200) {
                        Logger.info('Fetch was successed.');

                        if (Config.test) {
                            resolve(StubApiResponse);
                        }
                        resolve(JSON.parse(body));
                    }
                    else {
                        if (!response || !response.statusCode) return;

                        Logger.error(`When request ${url} error happened: ${response.statusCode};`);
                        reject(response.statusCode);
                    }
                }
            );
        });
    }

    private initialize(): void {
        Logger.info(`Current setting is ${JSON.stringify(Config)}.`);
        this.eventPublisher.addSubscriber(new AlarmNotifierService());
        this.eventPublisher.addSubscriber(new TelegramNotifierService());
    }
}
