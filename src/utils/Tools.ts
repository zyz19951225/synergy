export function dateFmt(timeStamp: number = Date.now(), format: string = 'YYYY-MM-DD hh:mm:ss'): string {
    let date = new Date(timeStamp);
    let formatNumber = (n: number): string => (n < 10 ? '0' + n : String(n));
    let str = format
        .replace('YYYY', String(date.getFullYear()))
        .replace('MM', formatNumber(date.getMonth() + 1))
        .replace('DD', formatNumber(date.getDate()))
        .replace('hh', formatNumber(date.getHours()))
        .replace('mm', formatNumber(date.getMinutes()))
        .replace('ss', formatNumber(date.getSeconds()));
    return str;
}
