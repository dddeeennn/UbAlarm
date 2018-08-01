var TelegramBot = require('node-telegram-bot-api');
var Keys = require('./../keys.json');
var Config = require('./../config.json');

console.log(Keys.BotKey);

const bot = new TelegramBot(Keys.BotKey, {
  polling: true,
  request: {
    proxy: Config.proxyUrl,
  },
});


export class TelegramPublisher {
    public sendMsg(text): void{
        bot.sendMessage(Config.chatIdForNotification, text);
    }
}
