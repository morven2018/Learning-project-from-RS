import { IState } from './types/interfaces';

const KEY_FOR_SAVE_TO_LOCALSTORAGE = 'exampleSpaApp';

export default class State implements IState {
  public fields: Map<string, string>;

  constructor() {
    this.fields = State.loadState();

    window.addEventListener('beforeunload', this.saveState.bind(this));
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

  saveState() {
    const fieldsObject = Object.fromEntries(this.fields.entries());
    localStorage.setItem(
      KEY_FOR_SAVE_TO_LOCALSTORAGE,
      JSON.stringify(fieldsObject)
    );
  }

  public static loadState(): Map<string, string> {
    const storageItem = localStorage.getItem(KEY_FOR_SAVE_TO_LOCALSTORAGE);
    if (storageItem) {
      const fieldObject = JSON.parse(storageItem);
      return new Map(Object.entries(fieldObject));
    }
    return new Map();
  }
}
