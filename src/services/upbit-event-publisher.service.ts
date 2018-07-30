import { Logger } from './logger.service';
import { ApiResponseModel } from '../models/api-response.model';
var Config = require('./../config.json');

export class UpbitEventPublisher {
    private logger: Logger;

    constructor() {
        this.logger = new Logger();
    }

    public handleResponse(model: ApiResponseModel): void {
        this.logger.info(`Start handling the response...`);

        if (!model.data || !model.success) {
            this.logger.warn(`Unsuccess parsed result ${JSON.stringify(model)}`);
            return;
        }

        if (!model.data.list.length) {
            this.logger.warn(`Are we have some problems? Empty list of new messages: ${JSON.stringify(model)}`);
            return;
        }

        function createDateAsUTC(date): Date {
            return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
        }

        function convertDateToUTC(date): Date {
            return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        }

        const needNotify = model.data.list.some((listItem) =>
            !!(~listItem.title.indexOf(Config.matchWord) &&
                (+convertDateToUTC(listItem.created_at) - +createDateAsUTC(Date.now())) < Config.eventFreshnessMin));

        if (needNotify) {
            // TODO: notify subscribers and store in temporary storage
        }
    }
}