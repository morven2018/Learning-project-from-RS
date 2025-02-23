import AppController from '../controller/controller';
import { AppView } from '../view/appView';
import { getRespDataType, dataType } from '../../types';

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
