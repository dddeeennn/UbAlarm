export function isOutOfInterval(timestamp: Date, intervalMin: number): boolean {
    return (Date.now() - +timestamp) > intervalMin * 60 * 1000;
}