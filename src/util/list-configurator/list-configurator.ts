import { isNotNullable, isNullable } from '../is-nullable';
import type { IElementInfo, IJSONObject } from '../../types/interfaces';

export default class ListConfigurator {
  public static toJSON(
    elementList: HTMLElement[],
    lastId: number
  ): IJSONObject {
    if (isNullable(lastId)) lastId = 2;
    const result: IJSONObject = {
      list: [],
      lastId: lastId - 1,
    };
    if (elementList?.length > 0) {
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
    }
    return result;
  }

  public static fromJSON(
    jsonData: unknown
  ): { list: HTMLElement[]; lastId: number } | undefined {
    // console.log('fromJSON');
    if (ListConfigurator.isIJSONObject(jsonData)) {
      // console.log(jsonData);
      for (const element of jsonData.list) element.id = element.id.slice(1);
      return {
        list: jsonData.list,
        lastId: jsonData.lastId,
      };
    }
    return undefined;
  }

  public static isIJSONObject(
    data: unknown
  ): data is { list: HTMLElement[]; lastId: number } {
    if (typeof data !== 'object' || isNullable(data)) {
      return false;
    }

    if (!('list' in data) || !('lastId' in data)) {
      return false;
    }
    if (isNotNullable(data.list) && !Array.isArray(data.list)) {
      return false;
    }
    if (isNotNullable(data.list)) {
      for (const element of data.list) {
        if (!this.isIElementInfo(element)) {
          return false;
        }
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
