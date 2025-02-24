import AppLoader from './appLoader';
import { funcType } from '../../types';
import { IAppController } from '../../types/classes';

class AppController extends AppLoader implements IAppController {
    getSources(callback: funcType): void {
        super.getResp(
            {
                endpoint: 'sources',
            },
            callback
        );
    }

    getNews(e: MouseEvent, callback: funcType): void {
        let target = e.target! as HTMLElement;
        const newsContainer = e.currentTarget! as HTMLElement;

        while (target !== newsContainer) {
            if (target.classList.contains('source__item')) {
                const btnMenu = document.querySelector('.button-hide')!;

                if (!btnMenu.classList.contains('closed')) btnMenu.textContent = '<';
                else btnMenu.textContent = '>';

                btnMenu.classList.toggle('closed');
                const menuElements = document.querySelectorAll('.source-category');
                menuElements.forEach((element): boolean => element.classList.toggle('hidden'));

                const sourceId = target.getAttribute('data-source-id')!;
                if (newsContainer.getAttribute('data-source') !== sourceId) {
                    newsContainer.setAttribute('data-source', sourceId);
                    super.getResp(
                        {
                            endpoint: 'everything',
                            options: {
                                sources: sourceId,
                            },
                        },
                        callback
                    );
                }
                return;
            }
            target = target.parentNode as HTMLElement;
        }
    }
}

export default AppController;
