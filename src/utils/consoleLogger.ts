// tslint:disable:no-console

export class ConsoleLogger {
    public error(message: string | object, error?: Error | any, error2?: Error | any) {
        if (!error) {
            // tslint:disable-next-line:no-expression-statement
            console.error(message);
            return this;
        }
        // tslint:disable-next-line:no-expression-statement
        console.error(message, error);
        return this;
    }

    public info(message: string | object, data?: any) {
        if (!data) {
            // tslint:disable-next-line:no-expression-statement
            console.info(message);
            return this;
        }
        // tslint:disable-next-line:no-expression-statement
        console.info(message, data);
        return this;
    }

    public warn(message: string | object, data?: any) {
        if (!data) {
            // tslint:disable-next-line:no-expression-statement
            console.warn(message);
            return this;
        }
        // tslint:disable-next-line:no-expression-statement
        console.warn(message, data);
        return this;
    }
}
