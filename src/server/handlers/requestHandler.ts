import { injectable } from 'inversify';

type HTTP_METHODS = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

interface Creadentials {
    readonly id: string;
}

interface Auth {
    readonly credentials?: Creadentials;
}

export interface Request {
    readonly payload: any;
    readonly auth?: Auth;
}

export interface Response {
    code(statusCode: number): Response;
    message(httpMessage: string): Response;
}

export interface Reply {
    (err?: Error): Response;
    response(result: object): Response;
}

export type RequestHandlerFunction = (request: Request, reply: Reply) => Promise<Response>;

export interface HandlerMetaData {
    readonly description: string;
    readonly notes: string;
    readonly tags: ReadonlyArray<string>;
    readonly auth?: string;
}

@injectable()
export abstract class RequestHandler {
    public readonly method: HTTP_METHODS;
    public readonly url: string;
    public readonly handler: RequestHandlerFunction;
    public readonly metaData: HandlerMetaData;
}
