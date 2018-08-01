import { Logger } from './logger.service';
import { ApiResponseModel } from '../models/api-response.model';
import { TelegramPublisher } from './telegram-publisher.service';
import { Bittrex } from './bittrex.service';

var Config = require('./../config.json');
var telegramBot = new TelegramPublisher();
const platform = require('os').platform();

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

        function sleep(ms): void { //заменить на setInterval
            ms += new Date().getTime();
            while (new Date() < ms){}
        }


        function playSong(): void {

            var exec = require('child_process').exec;
            var cmdCommand = "";

            if(require('os').platform()=="darwin")//для осХ
                cmdCommand = "open ";

            exec(cmdCommand+"song.mp3", function(err, stdout, stderr) { //надо проверить на виндоус
                if (err) {
                      console.log("Song execute error!");//заменить на logger
                }
                else{
                      console.log("Playing song...");//заменить на logger
                      sleep(30*1000);//надо это заменить на setInterval
                }
            });
        }

        const needNotify = model.data.list.some((listItem) => {
              if((+createDateAsUTC(Date.now()) - +convertDateToUTC(listItem.created_at)) < Config.eventFreshnessMin*1000)
                  {
                      console.log("\x1b[32m",listItem.title);//выводим что покупать
                      telegramBot.sendMsg(listItem.title);
                      return true;
                  }
              return false;
        });

        if (needNotify) {
            console.log("\x1b[31m","Buy Now!!!");
            telegramBot.sendMsg("Buy now");
          //  var btx = new Bittrex();
          //  btx.buyNow("LTC");
            playSong();
        }
        else{
            console.log("nothing new");
            var btx = new Bittrex();
            btx.getQuantity("LTC");
            //new Bittrex().buyNow();


        }
    }
}
