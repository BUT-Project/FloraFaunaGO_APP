import {IDataManager} from "@/dal/IDataManager";

export default class AppClient extends IDataManager{

    private static instance: IDataManager;

    public constructor() {
        super();
    }

    static getInstance():AppClient{
        if(!AppClient.instance){
            AppClient.instance = new AppClient();
        }
        return AppClient.instance;
    }
}
/*
interface HttpClientResponse {
    request: ClientRequest;
    response: IncomingMessage;
    data: string;
}

export interface HttpClientRequestOptions {
    hostname: string;
    path: string;
    headers: Record<string, string>;
    timeout: number;
    proxy?: string;
}

class HttpClient {
    async post(json:any, options: HttpClientRequestOptions): Promise<HttpClientResponse> {
        const { hostname, path, headers, timeout, proxy } = options;
        const postContent = JSON.stringify(json);
        const requestOptions: RequestOptions = {
            port: 443,
            hostname,
            path,
            method: 'POST',
            headers: {
                ...headers,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postContent),
            },
            timeout,

            agent: undefined,
        };

        return new Promise<HttpClientResponse>((resolve, reject) => {
            const request = https.request(requestOptions, (response) => {
                const body: Buffer[] = [];
                response.on('data', (chunk) => body.push(chunk));
                response.on('end', () => {
                    resolve({
                        request,
                        response,
                        data: Buffer.concat(body).toString(),
                    });
                });
            });

            request.on('error', reject);
            request.on('timeout', () => {
                request.destroy();
                reject(new Error(`Time out error: request took over ${timeout}ms.`));
            });

            request.write(postContent);
            request.end();
        });
    }
}*/