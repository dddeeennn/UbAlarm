import { Logger } from '../logger.service';
import { Notifier } from './notifier.interface';
var exec = require('child_process').exec;
var os = require('os');

export class AlarmNotifierService implements Notifier {
    private logger: Logger;

    constructor() {
        this.logger = new Logger();
    }

    notify(message: string): void {
        this.logger.info(`Start alarm notification ...`);

        const command = this.buildCommand();

        exec(command, (err, stdout, stderr) => {
            if (err) {
                this.logger.error(`When tried run ${command} an error occured: ${err};${stderr};${stdout}`);
            } else {
                this.logger.info(`Command '${command}' was executed successfully.`);
            }
        });
    }

    private buildCommand(): string {
        const songName = 'song.mp3';
        if (~os.platform().indexOf("darwin"))
            return `open ${songName}`;

        return songName;
    }
}
