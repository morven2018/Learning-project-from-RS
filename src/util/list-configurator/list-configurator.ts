interface IJSONObject {
  list: Array<IElementInfo>;
  lastId: number;
}

interface IElementInfo {
  id: string;
  title: string;
  weight: string;
}

export default class ListConfigurator {
  public static toJSON(
    elementList: HTMLElement[],
    lastID: number
  ): IJSONObject {
    const result: IJSONObject = {
      list: [],
      lastId: lastID - 1,
    };
    if (elementList.length > 0)
      for (const element of elementList) {
        if (
          element.children[1] instanceof HTMLInputElement &&
          element.children[2] instanceof HTMLInputElement
        ) {
          const titleInput = element.children[1];
          const valueInput = element.children[2];
          const elementInfo = {
            id: element.id.toString(),
            title: titleInput.value,
            weight: valueInput.value,
          };
          console.log(elementInfo);
          result.list.push(elementInfo);
        }
      }
    return result;
  }
}
