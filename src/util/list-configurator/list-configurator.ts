import type {
  IElementInfo,
  IJSONObject,
  IListCreator,
} from '../../types/interfaces';
import { isNotNullable, isNullable } from '../is-nullable';

export default class ListConfigurator {
  public static toJSON(
    elementList: HTMLElement[],
    lastId: number
  ): IJSONObject {
    const result: IJSONObject = {
      list: [],
      lastId: lastId - 1,
    };
    if (elementList?.length > 0)
      for (const element of elementList) {
        if (
          element.children[1] instanceof HTMLInputElement &&
          element.children[2] instanceof HTMLInputElement
        ) {
          const titleInput = element.children[1];
          const valueInput = element.children[2];
          const elementInfo = {
            id: `#${element.id.toString()}`,
            title: titleInput.value,
            weight: valueInput.value,
          };
          result.list.push(elementInfo);
        }
      }
    return result;
  }

  public static fromJSON(
    jsonData: unknown,
    list: IListCreator
  ): {
    elements: HTMLElement[];
    lastId: number;
  } {
    const elements: HTMLElement[] = [];
    if (ListConfigurator.isIJSONObject(jsonData)) {
      list.clearList();
      for (const element of jsonData.list) {
        const parameters = {
          id: element.id.slice(1),
          title: element.title,
          weight: element.weight,
        };

        const newElement = list.addElement(parameters);

        if (isNotNullable(newElement)) {
          elements.push(newElement);
        }
      }
      list.nextId = jsonData.lastId;
    }
    return {
      elements,
      lastId: list.nextId,
    };
  }

  public static isIJSONObject(data: unknown): data is IJSONObject {
    if (typeof data !== 'object' || isNullable(data)) {
      return false;
    }
    if (!('list' in data) || !('lastId' in data)) {
      return false;
    }
    if (!Array.isArray(data.list)) {
      return false;
    }
    for (const element of data.list) {
      if (!ListConfigurator.isIElementInfo(element)) {
        return false;
      }
    }
    if (typeof data.lastId !== 'number') {
      return false;
    }
    return true;
  }

  public static isIElementInfo(data: unknown): data is IElementInfo {
    if (typeof data !== 'object' || isNullable(data)) {
      return false;
    }

    if (!('id' in data) || !('title' in data) || !('weight' in data)) {
      return false;
    }

    if (
      typeof data.id !== 'string' ||
      typeof data.title !== 'string' ||
      typeof data.weight !== 'string'
    ) {
      return false;
    }

    return true;
  }
}
