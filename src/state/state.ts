import { isNotNullable } from '../util/is-nullable';

const KEY_FOR_SAVE_TO_LOCALSTORAGE = 'DecisionMakingToolApp';

export default class State {
  public fields: Map<string, string>;
  constructor() {
    this.fields = State.loadState();

    window.addEventListener('beforeunload', this.saveState.bind(this));
  }

  public static isFieldsObject(data: unknown): data is Record<string, string> {
    if (typeof data !== 'object' || data === null) {
      return false;
    }
    for (const [key, value] of Object.entries(data)) {
      if (typeof key === 'string' || typeof value !== 'string') return false;
    }
    return true;
  }
  public static loadState(): Map<string, string> {
    const storageItem = localStorage.getItem(KEY_FOR_SAVE_TO_LOCALSTORAGE);
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

  public saveState(): void {
    const fieldsObject = Object.fromEntries(this.fields.entries());
    localStorage.setItem(
      KEY_FOR_SAVE_TO_LOCALSTORAGE,
      JSON.stringify(fieldsObject)
    );
  }
}
