import data from '../../assets/data/cars.json';
import type {
  JsonModels,
  IJsonCarInfo,
  IJsonCarInfoItem,
  ICarCreate,
} from '../types/interfaces';

export default class CarGenerator {
  public static generateCar(): ICarCreate {
    const carName = CarGenerator.generateCarName();
    const carColor = CarGenerator.generateColor();
    return {
      name: carName,
      color: carColor,
    };
  }

  private static generateCarName(): string | undefined {
    const modelList = CarGenerator.loadData();
    if (modelList) {
      const brandItem = Math.floor(Math.random() * modelList.length);
      const markList = modelList[brandItem];
      const markItem = Math.floor(Math.random() * markList.models.length);
      const brand = modelList[brandItem].name;
      const mark = markList.models[markItem].name;

      const carName = `${mark} ${brand}`;
      return carName;
    }
    return undefined;
  }

  private static generateColor(): string {
    const r = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0');
    const g = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0');
    const b = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, '0');
    return `#${r}${g}${b}`.toUpperCase();
  }

  private static loadData(): JsonModels | void {
    try {
      if (
        Array.isArray(data) &&
        data.every((item) => CarGenerator.isJsonCarInfo(item))
      )
        return data;
      throw new Error('not correct Json data');
    } catch (error) {
      console.error(error);
    }
  }

  private static isJsonCarInfoItem(item: unknown): item is IJsonCarInfoItem {
    if (!item || typeof item !== 'object') return false;

    const result =
      CarGenerator.hasStringProperties(item, [
        'id',
        'name',
        'cyrillic-name',
        'class',
      ]) &&
      CarGenerator.hasNumberProperties(item, ['year-from', 'year-to']) &&
      item.path &&
      typeof item.path === 'object' &&
      CarGenerator.hasStringProperties(item.path, ['mark-id']);

    if (typeof result === 'boolean') return result;
    return false;
  }

  private static isJsonCarInfo(car: unknown): car is IJsonCarInfo {
    const result =
      car &&
      typeof car === 'object' &&
      CarGenerator.hasStringProperties(car, [
        'id',
        'name',
        'cyrillic-name',
        'country',
      ]) &&
      typeof car.popular === 'boolean' &&
      Array.isArray(car.models) &&
      car.models.every((element) => CarGenerator.isJsonCarInfoItem(element));

    if (typeof result === 'boolean') return result;
    return false;
  }

  private static hasStringProperties = (
    property: unknown,
    keys: string[]
  ): property is Record<string, string> => {
    if (!property || typeof property !== 'object') return false;
    return keys.every(
      (k) =>
        k in property &&
        typeof property === 'string' &&
        typeof property[k] === 'string'
    );
  };

  private static hasNumberProperties = (
    property: unknown,
    keys: string[]
  ): property is Record<string, number> => {
    if (!property || typeof property !== 'object') return false;
    return keys.every(
      (k) =>
        k in property &&
        typeof property === 'string' &&
        typeof property[k] === 'number'
    );
  };
}
