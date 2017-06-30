type HTTP_METHODS = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

export interface Request {
    readonly payload: any;
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
}

export interface RequestHandler {
    readonly method: HTTP_METHODS;
    readonly url: string;
    readonly handler: RequestHandlerFunction;
    readonly metaData: HandlerMetaData;
}
