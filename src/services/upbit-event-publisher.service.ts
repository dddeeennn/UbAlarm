import { Logger } from './logger.service';
import { ApiResponseModel } from '../models/api-response.model';
import { Bittrex } from './bittrex.service';
import { Notifier } from './notifiers/notifier.interface';
import { isOutOfInterval } from './date-time.helper';

var Config = require('./../config.json');

export class UpbitEventPublisher {
    private logger: Logger;
    private subscribers: Notifier[] = [];
    private alreadyNotifiedMessages: string[] = [];

    constructor() {
        this.logger = new Logger();
    }

    addSubscriber(sub: Notifier) {
        this.subscribers.push(sub);
    }

    handleResponse(model: ApiResponseModel): void {
        this.logger.info(`Start handling the response...`);

        if (!model.data || !model.success) {
            this.logger.warn(`Unsuccess parsed result ${JSON.stringify(model)}`);
            return;
        }

        if (!model.data.list.length) {
            this.logger.warn(`Are we have some problems? Empty list of new messages: ${JSON.stringify(model)}`);
            return;
        }

        const toNotify = model.data.list.filter(listItem => {
            if (isOutOfInterval(new Date(listItem.created_at), Config.eventFreshnessMin)) return false;

            return !this.alreadyNotifiedMessages.some(id => id == listItem.id);
        });

        toNotify.forEach(item => {
            this.logger.info(`Send notification about ${item}`);
            this.subscribers.forEach(sub => sub.notify(item.title));

            this.logger.info(`Store already notified message id = ${item.id}.`);
            this.alreadyNotifiedMessages.push(item.id);
        });

        if (!toNotify.length)
            this.logger.info('There is nothing new.');
    }
}
