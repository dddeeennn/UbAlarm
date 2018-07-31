var TelegramBot = require('node-telegram-bot-api');
const token = '626947856:AAEGbrVEdMv9ob-v6N_3PD8rzPsuC5WqXUA';
var bot = new TelegramBot(token, {polling: true});
var Config = require('./../config.json');

export class TelegramPublisher {
    public sendMsg(text): void{
        // send a message to the chat acknowledging receipt of their message
        bot.sendMessage(Config.chatIdForNotification, text);
    }
}
