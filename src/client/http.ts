const http = (method: string, url: string, data?: any, token?: string) => {
    const headers: any = {
        'Content-type': 'application/json'
    };
    if (token) {
        // tslint:disable-next-line:no-expression-statement
        headers.authorization = token;
    }

    const options: any = {
        method,
        headers
    };

    if (data) {
        // tslint:disable-next-line:no-expression-statement
        options.body = JSON.stringify(data);
    }

    return fetch(url, options)
        .then(res => {
            if (!res) {
                throw new Error(`empty ${url} response`);
            }
            return res.json();
        });
};

const get = (url: string, token?: string) => http('get', url, null, token);
const post = (url: string, data: any, token?: string) => http('post', url, data, token);

export { get, post };
