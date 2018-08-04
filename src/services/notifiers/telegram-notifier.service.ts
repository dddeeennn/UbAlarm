var TelegramBot = require('node-telegram-bot-api');

import { Notifier } from './notifier.interface';
import { Logger } from '../logger.service';
var Keys = require('./../../keys.json');
var Config = require('./../../config.json');

export class TelegramNotifierService implements Notifier {
    private logger = new Logger();
    private bot: any;

    constructor() {
        this.logger.info('Initializing telegram notifier...');
        this.logger.info(`Telegram API settings:`);
        this.logger.info(`botKey=${Keys.BotKey}`);
        this.logger.info(`telegramProxy=${Config.telegramProxyUrl}`);
        this.bot = new TelegramBot(Keys.BotKey, {
            polling: true,
            request: {
                proxy: Config.telegramProxyUrl,
            },
        });
    }

    notify(message: string): void {
        this.logger.info('Send telegram notification...');
        this.logger.info(`chatIdForNotification=${Config.chatIdForNotification}`);
        this.bot.sendMessage(Config.chatIdForNotification, 'Buy right now!!!');
        this.bot.sendMessage(Config.chatIdForNotification, message);
    }
}
