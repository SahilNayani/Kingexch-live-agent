export class DateTime {
    static now(date: Date): Date {
        let time = new Date();
        if (date == null) {
            date = new Date();
        }
        date.setHours(time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
        return date;
    }
    static resetTime(date: Date): Date {
        if (date == null) {
            date = new Date();
        }
        date.setHours(0, 0, 0, 1);
        return date;
    }
    static getDateTime(date: Date, time: Date): Date {
        if (date == null) {
            date = new Date();
        }
        if (time == null) {
            time = new Date();
        }
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
    }
}