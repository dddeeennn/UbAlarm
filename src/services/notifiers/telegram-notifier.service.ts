var TelegramBot = require('node-telegram-bot-api');

import { Notifier } from './notifier.interface';
import { Logger } from '../logger.service';
var Keys = require('./../../keys.json');
var Config = require('./../../config.json');

export class TelegramNotifierService implements Notifier {
    private logger = new Logger();
    private bot: any;

    constructor() {
        Logger.info('Initializing telegram notifier...');
        Logger.info(`Telegram API settings:`);
        Logger.info(`botKey=${Keys.BotKey}`);
        Logger.info(`telegramProxy=${Config.telegramProxyUrl}`);
        this.bot = new TelegramBot(Keys.BotKey, {
            polling: true,
            request: {
                proxy: Config.telegramProxyUrl,
            },
        });
    }

    notify(message: string): void {
        Logger.info('Send telegram notification...');
        Logger.info(`chatIdForNotification=${Config.chatIdForNotification}`);
        this.bot.sendMessage(Config.chatIdForNotification, 'Buy right now!!!');
        this.bot.sendMessage(Config.chatIdForNotification, message);
    }
}
