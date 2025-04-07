import type { ICarCreate, ICar } from '../types/api-interfaces';
import ApiClient from './api-client';
import CarGenerator from './car-generator';

export default class CarCreator {
  private static isCreating = false;
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

  public static async createNCars(n: number): Promise<ICar[]> {
    if (n <= 0 || this.isCreating) return [];

    this.isCreating = true;
    try {
      const carsToCreate = Array.from({ length: n }, () =>
        CarGenerator.generateCar()
      );
      const creationPromises = carsToCreate
        .filter(Boolean)
        .map((car) => this.createCar(car));
      const result = await Promise.all(creationPromises);

      return result;
    } catch {
      console.error('Error');
    } finally {
      this.isCreating = false;
    }
  }
}
