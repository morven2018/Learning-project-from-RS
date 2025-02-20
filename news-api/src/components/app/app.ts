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

class App {
    private controller;
    private view;
    constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    }

    start() {
        document.querySelector('.sources')!.addEventListener('click', (e: Event) => {
            const mEvent = e as MouseEvent;
            this.controller.getNews(mEvent, (data: dataType): void => this.view.drawNews(data));
        });
        this.controller.getSources((data: dataSourcesType): void => this.view.drawSources(data));
    }
}

export default App;
