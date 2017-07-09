import { ConsoleLogger } from './consoleLogger';

const loggerInstance = new ConsoleLogger();

export class Logger {
    public static error(message: string | object, error?: Error | any, error2?: Error | any) {
        return loggerInstance.error(message, error, error2);
    }

    public static info(message: string | object, data?: any) {
        return loggerInstance.info(message, data);
    }

    public static warn(message: string | object, data?: any) {
        return loggerInstance.warn(message, data);
    }
}
