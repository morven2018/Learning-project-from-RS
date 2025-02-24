import { funcType, RequestOptions, methodType, articleType, sourcesType, Articles, IResponse } from '.';

export interface IApp {
    start(): void;
}

export interface IAppController extends ILoader {
    getSources(callback: funcType): void;
    getNews(e: MouseEvent, callback: funcType): void;
}

export interface ILoader {
    getResp(params: { endpoint: string; options?: RequestOptions }, callback?: funcType): void;
    errorHandler(res: IResponse): IResponse;
    makeUrl(options: RequestOptions, endpoint: string): string;
    load(method: methodType, endpoint: string, callback: funcType, options?: RequestOptions): void;
}

export interface INews {
    draw(data: Array<articleType>): void;
}

export interface ISources {
    draw(data: Array<sourcesType>): void;
}

export interface IAppView {
    news: INews;
    sources: ISources;
    drawNews(data: Articles): void;
    drawSources(data: IResponse): void;
}
