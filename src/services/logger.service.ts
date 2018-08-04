const winston = require('winston');
const dailyRotateFile = require('winston-daily-rotate-file');

export class Logger {
    private static defaultOpts = {
        datePattern: 'YYYY-MM-DD-HH',
        dirname: './logs',
        maxSize: '20m',
        maxFiles: '14d'
    };
    private static allOpts = Object.assign({}, Logger.defaultOpts, { filename: 'all-%DATE%.log' });
    private static errorOpts = Object.assign({}, Logger.defaultOpts, {
        filename: 'error-%DATE%.log',
        level: 'error'
    });

    private static logger = winston.createLogger({
        transports: [
            new winston.transports.Console(),
            new (winston.transports.DailyRotateFile)(Logger.allOpts),
            new (winston.transports.DailyRotateFile)(Logger.errorOpts)
        ]
    });;

    public static info(message: string): void {
        this.logger.info(message);
    }

    public static warn(message: string): void {
        this.logger.warn(message);
    }

    public static error(message: string): void {
        this.logger.error(message);
    }

    public static startTimer(): any {
        return this.logger.startTimer();
    }
}
