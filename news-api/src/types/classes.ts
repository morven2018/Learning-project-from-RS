import { FuncType, RequestOptions, MethodType, SourcesType, Articles, IResponse, ArticleType } from '.';

export interface IApp {
    start(): void;
}

export interface IAppController extends ILoader {
    getSources(callback: FuncType): void;
    getNews(e: MouseEvent, callback: FuncType): void;
}

export interface ILoader {
    getResp(params: { endpoint: string; options?: RequestOptions }, callback?: FuncType): void;
    errorHandler(res: IResponse): IResponse;
    makeUrl(options: RequestOptions, endpoint: string): string;
    load(method: MethodType, endpoint: string, callback: FuncType, options?: RequestOptions): void;
}

export interface INews {
    draw(data: Array<ArticleType>): void;
}

export interface ISources {
    draw(data: Array<SourcesType>): void;
}

export interface IAppView {
    news: INews;
    sources: ISources;
    drawNews(data: Articles): void;
    drawSources(data: IResponse): void;
}
