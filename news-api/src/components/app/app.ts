import AppController from '../controller/controller';
import { AppView } from '../view/appView';

type dataSourcesType = {
    status: 'ok' | 'error';
    sources: Array<sourcesType>;
};
type sourcesType = {
    id: string;
    name: string;
    description: string;
    url: string;
    category: string;
    language: string;
    country: string;
};

type dataType = { articles: Array<articleType>; status: 'ok' | 'error'; totalResults: number };
type articleType = {
    source: {
        id: string;
        name: string;
    };
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
};
type emptyType = '';
type getRespDataType = dataType | emptyType | dataSourcesType;
class App {
    private controller;
    private view;
    constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    }

    start(): void {
        document.querySelector('.sources')!.addEventListener('click', (e: Event) => {
            const mEvent = e as MouseEvent;
            this.controller.getNews(mEvent, (data: getRespDataType): void => {
                if (typeof data !== 'string' && 'articles' in data) this.view.drawNews(data as dataType);
            });
        });
        this.controller.getSources((data: getRespDataType): void => {
            if (typeof data !== 'string' && 'sources' in data) this.view.drawSources(data);
        });
    }
}

export default App;
