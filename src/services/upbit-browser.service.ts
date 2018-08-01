import { Logger } from './logger.service';
import { UpbitEventPublisher } from './upbit-event-publisher.service';
import { ApiResponseModel } from '../models/api-response.model';
const https = require('https');
const request = require('request');
var Config = require('./../config.json');

export class UpbitBrowser {
    private interval: NodeJS.Timer;
    private eventPublisher: UpbitEventPublisher;
    private logger: Logger;

    constructor() {
        this.eventPublisher = new UpbitEventPublisher();
        this.logger = new Logger();
    }

    public doWork() {
        this.logger.info(`Current setting is ${JSON.stringify(Config)}.`);
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
            //this.logger.info(`Fetch ${url}`);
            request(
                {
                    'url': url,
                    'proxy': ""//Config.proxyUrl //тут пока лучше без прокси, надежнее будет
                },
                (error, response, body) => {
                    if (!error && response.statusCode == 200) {
                        this.logger.info('Fetch was succesed.');

                        if(Config.test){ //для тестов подменяем JSON, подставляем текущее дату-время
                            body = '{"success":true,"data":{"total_count":16,"total_pages":1,"list":[{"created_at":"'+new Date()+'","updated_at":"2018-07-31T22:46:38+09:00","id":480,"title":"(XVG)","view_count":752909},{"created_at":"2018-07-27T14:41:11+09:00","updated_at":"2018-07-31T22:46:38+09:00","id":480,"title":"(RFR, DMT)","view_count":752909},{"created_at":"2018-07-25T12:16:03+09:00","updated_at":"2018-07-31T22:46:38+09:00","id":476,"title":"(IOST)","view_count":341449},{"created_at":"2018-07-23T18:41:13+09:00","updated_at":"2018-07-31T22:46:38+09:00","id":472,"title":"BAT, ADT)","view_count":368423}],"fixed_notices":[],"has_more":false,"before":null}}';
                        }
                        resolve(JSON.parse(body));
                    }
                    else {
                        if(!response || !response.statusCode) return;

                        this.logger.error(`When request ${url} error happened: ${response.statusCode};`);
                        reject(response.statusCode);
                    }
                }
            );
        });
    }
}
