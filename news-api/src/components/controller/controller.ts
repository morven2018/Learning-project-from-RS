import AppLoader from './appLoader';
/*
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
};*/

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

type getRespDataType = dataType | emptyType;

class AppController extends AppLoader {
    getSources(callback: (data: getRespDataType) => void) {
        super.getResp(
            {
                endpoint: 'sources',
            },
            callback
        );
    }

    getNews(e: MouseEvent, callback: (data: getRespDataType) => void) {
        let target = e.target! as HTMLElement;
        const newsContainer = e.currentTarget! as HTMLElement;

        while (target !== newsContainer) {
            if (target.classList.contains('source__item')) {
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
