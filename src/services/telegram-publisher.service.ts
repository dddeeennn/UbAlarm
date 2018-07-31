var TelegramBot = require('node-telegram-bot-api');
const token = '626947856:AAEGbrVEdMv9ob-v6N_3PD8rzPsuC5WqXUA';
var Config = require('./../config.json');
const bot = new TelegramBot(token, {
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
