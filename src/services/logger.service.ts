export class Logger {
    public info(message: string): void {
        console.log(`[INFO][${this.getTimestamp()}] ${message}`);
    }

    public warn(message: string): void {
        console.warn(`[WARN][${this.getTimestamp()}] ${message}`);
    }

    public error(message: string): void {
        console.error(`[EREOR][${this.getTimestamp()}] ${message}`);
    }

    private getTimestamp(): string {
        return new Date().toUTCString();
    }
}