import type { ICarCreate, ICar } from '../types/api-interfaces';
import ApiClient from './api-client';
import CarGenerator from './car-generator';

export default class CarCreator {
  public static async createCar(carInfo: ICarCreate): Promise<ICar> {
    try {
      const createdCar = await ApiClient.createCar(carInfo.name, carInfo.color);
      return createdCar;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Failed to create car:', error.message);
      } else {
        console.error('Unknown error occur on creating car');
      }
      throw error;
    }
  }

  public static createNCars(n: number): void {
    if (n <= 0) return;

    const creationPromises: Promise<ICar | void>[] = [];

    for (let index = 0; index < n; index += 1) {
      const car = CarGenerator.generateCar();
      if (car) {
        creationPromises.push(CarCreator.createCar(car).catch(console.error));
      }
    }

    Promise.all(creationPromises).catch(console.error);
  }
}
