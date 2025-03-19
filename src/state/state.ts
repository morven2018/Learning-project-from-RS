import type { IState, IValueList } from '../types/interfaces';
import { isNotNullable, isNullable } from '../util/is-nullable';
import ListConfigurator from '../util/list-configurator/list-configurator';
import type ListCreator from '../util/list-option/list-option';

// const KEY_FOR_SAVE_TO_LOCALSTORAGE = 'DecisionMakingToolApp';
const KEY_FOR_SAVE_LIST = 'optionList';
export default class State implements IState {
  public fields: Map<string, string>;
  private listCreator: ListCreator | undefined;

  constructor() {
    this.fields = State.loadState();
  }

  public static loadState(): Map<string, string> {
    const storageItem = localStorage.getItem(KEY_FOR_SAVE_LIST);

    if (isNotNullable(storageItem)) {
      try {
        const parsed: unknown = JSON.parse(storageItem);
        if (typeof parsed === 'object' && State.isFieldsObject(parsed)) {
          return new Map(Object.entries(parsed));
        }
      } catch (error) {
        console.error(error);
      }
    }
    return new Map<string, string>();
  }

  public static isFieldsObject(data: unknown): data is Record<string, string> {
    if (isNullable(data)) {
      return false;
    }

    for (const key in data) {
      if (typeof key === 'string' || typeof data[key] !== 'string') {
        return false;
      }
    }
    return true;
  }

  public static loadFromLocalStorage():
    | { list: HTMLElement[]; lastId: number }
    | undefined {
    const savedList = localStorage.getItem(KEY_FOR_SAVE_LIST);
    if (isNotNullable(savedList)) {
      try {
        const jsonData: unknown = JSON.parse(savedList);
        return ListConfigurator.fromJSON(jsonData);
      } catch (error) {
        console.error(error);
      }
    }
    return undefined;
  }

  public static getOptionList(): IValueList | undefined {
    const savedData = this.loadFromLocalStorage();
    if (savedData) {
      const valueList: IValueList = {};
      for (const element of savedData.list) {
        if (
          ListConfigurator.isIElementInfo(element) &&
          isNotNullable(element.title)
        ) {
          valueList[element.title] = Number.parseInt(element.weight);
        }
      }
      return valueList;
    }
    return undefined;
  }

  public static saveToLocalStorage(
    elementList: HTMLElement[],
    lastId: number
  ): void {
    if (isNotNullable(elementList) && Array.isArray(elementList)) {
      const storedElements = [
        ...new Set(elementList.map((element) => element.getAttribute('id'))),
      ]
        .map((id) =>
          elementList.find((element) => element.getAttribute('id') === id)
        )
        .filter((element) => isNotNullable(element));

      localStorage.removeItem(KEY_FOR_SAVE_LIST);

      const content = ListConfigurator.toJSON(storedElements, lastId);

      const jsonContent = JSON.stringify(content);

      localStorage.setItem(KEY_FOR_SAVE_LIST, jsonContent);
    }
  }

  public static shuffleObject<T>(object: Record<string, T>): Record<string, T> {
    const entries = Object.entries(object);

    for (let index = entries.length - 1; index > 0; index--) {
      const index_ = Math.floor(Math.random() * (index + 1));
      [entries[index], entries[index_]] = [entries[index_], entries[index]];
    }

    return Object.fromEntries(entries);
  }

  public setListCreator(listCreator: ListCreator): void {
    this.listCreator = listCreator;
  }

  public getElements(): HTMLElement[] | undefined {
    return this.listCreator?.elements;
  }

  public getNextId(): number | undefined {
    return this.listCreator?.nextId;
  }

  public saveState(): void {
    const fieldsObject = Object.fromEntries(this.fields.entries());

    localStorage.setItem(KEY_FOR_SAVE_LIST, JSON.stringify(fieldsObject));

    if (this.listCreator) {
      State.saveToLocalStorage(
        this.listCreator.elements,
        this.listCreator.nextId
      );
    }
  }

  public setField(name: string, value: string): void {
    this.fields.set(name, value);
  }

  public getField(name: string): string {
    if (this.fields.has(name)) {
      const result = this.fields.get(name);
      if (typeof result === 'string') return result;
    }
    return '';
  }
}
