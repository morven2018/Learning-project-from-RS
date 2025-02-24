import './news.css';
import { articleType } from '../../../types';
import { INews } from '../../../types/classes';

class News implements INews {
    draw(data: articleType[]): void {
        const news: articleType[] =
            data.length >= 10 ? data.filter((_item: articleType, idx: number): boolean => idx < 10) : data;

        const fragment = document.createDocumentFragment();
        const newsItemTemp = document.querySelector('#newsItemTemp')! as HTMLTemplateElement;
        if (news.length === 0) {
            const msg = document.createElement('div');
            msg.className = 'no-found';
            fragment.append(msg);
            msg.textContent = 'No results found';
        } else {
            news.forEach((item: articleType, idx: number): void => {
                const newsClone = newsItemTemp.content.cloneNode(true)! as HTMLElement;
                if (newsClone) {
                    if (idx % 2) newsClone.querySelector('.news__item')?.classList.add('alt');
                    const newsClonePhoto = newsClone.querySelector('.news__meta-photo') as HTMLElement;
                    newsClonePhoto.style.backgroundImage = `url(${item.urlToImage || 'https://img.freepik.com/free-photo/worker-reading-news-with-tablet_1162-83.jpg?t=st=1740398726~exp=1740402326~hmac=31d461cff947a3ced32315aac99a1e279756d84715eb1f02c37f97f227f97477&w=1060'})`;
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
        }

        document.querySelector('.news')!.innerHTML = '';
        document.querySelector('.news')!.appendChild(fragment);
    }
}

export default News;
