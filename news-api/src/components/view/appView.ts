import News from './news/news';
import Sources from './sources/sources';
import { Articles, IResponse } from '../../types';
import { IAppView } from '../../types/classes';

export class AppView implements IAppView {
    public news: News;
    public sources: Sources;

    constructor() {
        this.news = new News();
        this.sources = new Sources();
    }

    drawNews(data: Articles): void {
        const values = data?.articles ? data?.articles : [];
        this.news.draw(values);
    }

    drawSources(data: IResponse): void {
        const values = data?.sources ? data?.sources : [];
        this.sources.draw(values);
    }
}

export default AppView;
