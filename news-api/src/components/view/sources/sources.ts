import './sources.css';
import { GroupedType, sourcesType } from '../../../types';
import { categoryType } from '../../../types/literalsEnums';
import { ISources } from '../../../types/classes';

class Sources implements ISources {
    private currIndex: number = 0;

    draw(data: sourcesType[]): void {
        const fragment = document.createDocumentFragment();

        const sourceItemTemp = document.querySelector('#sourceItemTemp')! as HTMLTemplateElement;

        const menu = document.createElement('div');
        menu.className = 'hidden-sources';

        const btnMenu = document.createElement('button');
        btnMenu.className = 'button-hide';
        btnMenu.classList.add('closed');
        btnMenu.textContent = '<';

        const sourcesWrapper = document.querySelector('.sources')!;
        sourcesWrapper.append(menu);
        menu.append(btnMenu);

        const wrapper = document.createElement('div');
        sourcesWrapper.append(wrapper);

        const groupedSources = this.groupByCategory(data);

        Object.keys(groupedSources).forEach((category: categoryType) => {
            const container = document.createElement('div');
            container.className = 'source-category';

            const header = document.createElement('div');
            header.textContent = category.toUpperCase();
            header.className = 'source-category__header';

            container.addEventListener('click', () => {
                const closedElement = document.querySelector('.open');
                closedElement?.classList.toggle('open');
                container.classList.toggle('open');
            });

            const content = document.createElement('div');
            content.className = 'source-category__content';
            const wrapperCarousel = document.createElement('div');
            wrapperCarousel.className = 'carousel';
            if (category === 'general') {
                const carousel = document.createElement('div');
                carousel.className = 'carousel_content';
                wrapperCarousel.append(carousel);

                content.append(wrapperCarousel);
                this.addElements(carousel, groupedSources, sourceItemTemp, category);

                const btns = document.createElement('div');
                content.append(btns);
                btns.className = 'button-list';

                const leftBth = document.createElement('button');
                leftBth.classList.add('left-button', 'inactive');
                leftBth.textContent = '<';
                btns.append(leftBth);

                const rightBth = document.createElement('button');
                rightBth.classList.add('right-button');
                rightBth.textContent = '>';
                btns.append(rightBth);

                this.setupCarouselNavigation(carousel, leftBth, rightBth, groupedSources[category]);
            } else this.addElements(content, groupedSources, sourceItemTemp, category);

            container.append(header, content);
            wrapper.append(container);
            fragment.append(wrapper);
        });

        sourcesWrapper.append(fragment);
        btnMenu.addEventListener('click', () => {
            if (!btnMenu.classList.contains('closed')) btnMenu.textContent = '<';
            else btnMenu.textContent = '>';

            btnMenu.classList.toggle('closed');
            const menuElements = document.querySelectorAll('.source-category');
            menuElements.forEach((element) => element.classList.toggle('hidden'));
        });
    }

    private addElements(
        parentElement: HTMLElement,
        groupedSources: GroupedType<sourcesType>,
        sourceItemTemp: HTMLTemplateElement,
        category: categoryType
    ): void {
        parentElement.innerHTML = '';
        groupedSources[category].forEach((item, index) => {
            if (category === 'general') {
                if (this.currIndex * 15 <= index && index < (this.currIndex + 1) * 15) {
                    const sourceClone = sourceItemTemp.content.cloneNode(true) as HTMLElement;

                    sourceClone.querySelector('.source__item-name')!.textContent = item.name;
                    sourceClone.querySelector('.source__item')!.setAttribute('data-source-id', item.id);
                    sourceClone.querySelector('.source__item')!.setAttribute('data-source-category', item.category);
                    parentElement.append(sourceClone);
                }
            } else {
                const sourceClone = sourceItemTemp.content.cloneNode(true) as HTMLElement;

                sourceClone.querySelector('.source__item-name')!.textContent = item.name;
                sourceClone.querySelector('.source__item')!.setAttribute('data-source-id', item.id);
                sourceClone.querySelector('.source__item')!.setAttribute('data-source-category', item.category);
                parentElement.append(sourceClone);
            }
        });
    }

    private groupByCategory(data: sourcesType[]): GroupedType<sourcesType> {
        const res = data.reduce((acc: GroupedType<sourcesType>, item: sourcesType): GroupedType<sourcesType> => {
            if (!acc[item.category]) {
                acc[item.category] = [];
            }
            acc[item.category].push(item);
            return acc;
        }, {} as GroupedType<sourcesType>);
        return res;
    }

    private setupCarouselNavigation(
        carousel: HTMLElement,
        leftButton: HTMLElement,
        rightButton: HTMLElement,
        items: sourcesType[]
    ): void {
        const updateButtons = () => {
            leftButton.classList.toggle('inactive', this.currIndex === 0);
            rightButton.classList.toggle('inactive', this.currIndex >= Math.ceil(items.length / 15) - 1);
        };

        const updateCarousel = () => {
            carousel.innerHTML = '';
            items.slice(this.currIndex * 15, (this.currIndex + 1) * 15).forEach((item) => {
                const srcClone = document.querySelector('#sourceItemTemp')! as HTMLTemplateElement;
                const sourceClone = srcClone.content.cloneNode(true) as HTMLElement;

                sourceClone.querySelector('.source__item-name')!.textContent = item.name;
                sourceClone.querySelector('.source__item')!.setAttribute('data-source-id', item.id);
                sourceClone.querySelector('.source__item')!.setAttribute('data-source-category', item.category);
                carousel.append(sourceClone);
            });
        };

        leftButton.addEventListener('click', () => {
            if (this.currIndex > 0) {
                this.currIndex -= 1;
                updateButtons();
                updateCarousel();
            }
        });

        rightButton.addEventListener('click', () => {
            if (this.currIndex < Math.ceil(items.length / 15) - 1) {
                this.currIndex += 1;
                updateButtons();
                updateCarousel();
            }
        });

        updateButtons();
        updateCarousel();
    }

    private setupCloseMenuOnItemClick(menu: HTMLElement): void {
        menu.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (target.classList.contains('source__item-name')) {
                const menuElements = document.querySelectorAll('.source-category');
                menuElements.forEach((element) => element.classList.add('hidden'));
                menu.classList.add('closed');
                const bth = document.querySelector('.button-hide')!;
                bth.textContent = '>';
            }
        });
    }
}

export default Sources;
