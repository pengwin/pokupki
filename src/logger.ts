export class Logger {
    public static error(message: string | object, error?: Error | any, error2?: Error | any) {
        if (!error) {
            // tslint:disable-next-line:no-console
            console.error(message);
            return;
        }
        // tslint:disable-next-line:no-console
        console.error(message, error);
    }

    public static info(message: string | object, data?: any) {
        if (!data) {
            // tslint:disable-next-line:no-console
            console.info(message);
            return;
        }
        // tslint:disable-next-line:no-console
        console.info(message, data);
    }
}
