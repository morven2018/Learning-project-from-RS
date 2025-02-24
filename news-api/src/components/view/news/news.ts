import './news.css';
import { articleType } from '../../../types';
import { INews } from '../../../types/classes';

class News implements INews {
    draw(data: articleType[]): void {
        const news: articleType[] =
            data.length >= 10 ? data.filter((_item: articleType, idx: number) => idx < 10) : data;

        const fragment = document.createDocumentFragment();
        const newsItemTemp = document.querySelector('#newsItemTemp')! as HTMLTemplateElement;

        news.forEach((item: articleType, idx: number) => {
            const newsClone = newsItemTemp.content.cloneNode(true)! as HTMLElement;
            if (newsClone) {
                if (idx % 2) newsClone.querySelector('.news__item')?.classList.add('alt');
                const newsClonePhoto = newsClone.querySelector('.news__meta-photo') as HTMLElement;
                newsClonePhoto.style.backgroundImage = `url(${item.urlToImage || 'img/news_placeholder.jpg'})`;
                newsClone.querySelector('.news__meta-author')!.textContent = item.author || item.source.name;
                newsClone.querySelector('.news__meta-date')!.textContent = item.publishedAt
                    .slice(0, 10)
                    .split('-')
                    .reverse()
                    .join('-');

                newsClone.querySelector('.news__description-title')!.textContent = item.title;
                newsClone.querySelector('.news__description-source')!.textContent = item.source.name;
                newsClone.querySelector('.news__description-content')!.textContent = item.description;
                newsClone.querySelector('.news__read-more a')!.setAttribute('href', item.url);

                fragment.append(newsClone);
            }
        });

        document.querySelector('.news')!.innerHTML = '';
        document.querySelector('.news')!.appendChild(fragment);
    }
}

export default News;
