export class Logger {
    public info(message: string): void {
        console.log(`[INFO][${this.getTimestamp()}] ${message}`);
    }

    public warn(message: string): void {
        console.warn(`\x1b[31m`,`[WARN][${this.getTimestamp()}] ${message}`);
    }

    public error(message: string): void {
        console.error(`\x1b[31m`,`[EREOR][${this.getTimestamp()}] ${message}`);
    }

    private getTimestamp(): string {
        return new Date().toUTCString();
    }
}
