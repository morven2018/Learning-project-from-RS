import data from '../../assets/data/cars.json';
import type {
  JsonModels,
  IJsonCarInfo,
  IJsonCarInfoItem,
} from '../types/interfaces';
import type { ICarCreate } from '../types/api-interfaces';

export default class CarGenerator {
  public static generateCar(): ICarCreate {
    const carName = CarGenerator.generateCarName();
    const carColor = CarGenerator.generateColor();
    console.log(carName, carColor);
    return {
      name: carName || 'no-name',
      color: carColor,
    };
  }

  private static generateCarName(): string | undefined {
    const modelList = CarGenerator.loadData();
    console.log('modelList', modelList);
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
      console.log(
        'dfdfggbngbn',
        Array.isArray(data) &&
          data.every((item) => CarGenerator.isJsonCarInfo(item))
      );
      if (
        Array.isArray(data) &&
        data.every((item) => CarGenerator.isJsonCarInfo(item))
      ) {
        console.log(data);
        return data;
      }

      throw new Error('not correct Json data');
    } catch (error) {
      console.error(error);
    }
  }

  private static isJsonCarInfoItem(item: unknown): item is IJsonCarInfoItem {
    // console.log('dfvdf', item);

    const result =
      item &&
      typeof item === 'object' &&
      'id' in item &&
      typeof item.id === 'string' &&
      'name' in item &&
      typeof item.name === 'string';
    // console.log('result', result);
    if (typeof result === 'boolean') return result;
    return false;
  }

  private static isJsonCarInfo(car: unknown): car is IJsonCarInfo {
    // console.log('car', car);
    const result =
      car &&
      typeof car === 'object' &&
      'id' in car &&
      typeof car.id === 'string' &&
      'name' in car &&
      typeof car.name === 'string' &&
      'cyrillic-name' in car &&
      typeof car['cyrillic-name'] === 'string' &&
      'country' in car &&
      typeof car.country === 'string' &&
      'popular' in car &&
      typeof car.popular === 'boolean' &&
      'models' in car &&
      Array.isArray(car.models) &&
      car.models.every((element) => CarGenerator.isJsonCarInfoItem(element));
    // console.log('result', result);
    if (typeof result === 'boolean') return result;
    return false;
  }
}
