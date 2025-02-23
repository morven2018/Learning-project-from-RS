import { funcType, RequestOptions, methodType } from '.';

export interface IAppController {
    getSources(callback: funcType): void;
    getNews(e: MouseEvent, callback: funcType): void;
}

export interface ILoader {
    getResp(params: { endpoint: string; options?: RequestOptions }, callback?: funcType): void;
    errorHandler(res: Response): Response;
    makeUrl(options: RequestOptions, endpoint: string): string;
    load(method: methodType, endpoint: string, callback: funcType, options?: RequestOptions): void;
}
