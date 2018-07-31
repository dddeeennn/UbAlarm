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

      function createDateAsUTC(date): Number {
            var newDate = new Date(date);
            return Date.UTC(newDate.getFullYear(),newDate.getMonth(),newDate.getDate(),newDate.getHours());
        }

        function convertDateToUTC(date): Number {
            var newDate = new Date(date);
            return Date.UTC(newDate.getFullYear(),newDate.getMonth(),newDate.getDate(),newDate.getHours());
        }

        function sleep(ms): void {
            ms += new Date().getTime();
            while (new Date() < ms){}
        }

        function playSong(): void {
            var exec = require('child_process').exec;
            exec("open song.mp3", function(err, stdout, stderr) { //надо проверить на виндоус
                if (err) {
                      console.log("Song execute error!");//заменить на logger
                }
                else{
                      console.log("Playing song...");//заменить на logger
                      sleep(30*1000);//задержка раз в 30 секунд
                }
            });
        }

        const needNotify = model.data.list.some((listItem) => {
                if((+createDateAsUTC(Date.now()) - +convertDateToUTC(listItem.created_at)) < Config.eventFreshnessMin*1000||Config.test)
                {
                      console.log("\x1b[32m",listItem.title);//выводим что покупать
                      return true;
                }
                return false;
              });


        if (needNotify||Config.test) {
            console.log("\x1b[31m","Buy Now!!!");
            console.log("\x1b[0m");
            playSong();
        }
        else{
            console.log("\x1b[32m","Nothing new");
            console.log("\x1b[0m");
            //playSong(); //для теста
        }
    }
}
