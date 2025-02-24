import AppController from '../controller/controller';
import { AppView } from '../view/appView';
import { GetDataType, Articles } from '../../types';
import { IApp } from '../../types/classes';

class App implements IApp {
    private controller;
    private view;

    constructor() {
        this.controller = new AppController();
        this.view = new AppView();
    }

    start(): void {
        document.querySelector('.sources')!.addEventListener('click', (e: Event): void => {
            const mEvent = e as MouseEvent;
            this.controller.getNews(mEvent, (data: GetDataType): void => {
                if (typeof data !== 'string' && 'articles' in data) this.view.drawNews(data as Articles);
            });
        });
        this.controller.getSources((data: GetDataType): void => {
            if (typeof data !== 'string' && 'sources' in data) {
                this.view.drawSources(data);
            }
        });
    }
}

export default App;
