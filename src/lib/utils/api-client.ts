import type { ICar, IPaginationParameters } from '../types/api-interfaces';
import { HttpMethod } from '../types/enums';

const baseURL = 'http://127.0.0.1:3000';

export default class ApiClient {
  public static async getCars(
    parameters?: IPaginationParameters
  ): Promise<{ cars: ICar[]; totalCount: number }> {
    let url = new URL(`${baseURL}/garage`);
    url = ApiClient.addSearchParams(url, parameters);

    const response = await fetch(url);
    const totalCount = Number.parseInt(
      response.headers.get('X-Total-Count') || '0',
      10
    );
    const cars: unknown = await response.json();
    if (!Array.isArray(cars) || !cars.every((car) => this.isICar(car)))
      throw new Error('Invalid car data received from server');
    return { cars, totalCount };
  }

  public static async getCar(id: number): Promise<ICar> {
    const url = `${baseURL}/garage/${id}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Car not found (status: ${response.status})`);
    }

    const car: unknown = await response.json();

    if (!ApiClient.isICar(car)) {
      throw new Error('Invalid car data received from server');
    }

    return car;
  }

  public static isICar(car: unknown): car is ICar {
    if (typeof car !== 'object' || car === null) {
      return false;
    }
    const result =
      car &&
      'id' in car &&
      typeof car.id === 'number' &&
      'name' in car &&
      typeof car.name === 'string' &&
      'color' in car &&
      typeof car.color === 'string';
    if (typeof result === 'boolean') return result;
    return false;
  }

  public static async createCar(name: string, color: string): Promise<ICar> {
    const carInfo = {
      name,
      color,
    };

    const url = `${baseURL}/garage`;

    const fetchBody = {
      method: HttpMethod.Post,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carInfo),
    };

    const response = await fetch(url, fetchBody);

    if (!response.ok) {
      throw new Error(`Failed to create car: ${response.statusText}`);
    }

    const createdCar: unknown = await response.json();

    if (!ApiClient.isICar(createdCar)) {
      throw new Error('Invalid car data received from server');
    }

    return createdCar;
  }

  public static async deleteCar(id: number): Promise<boolean> {
    const url = `${baseURL}/garage/${id}`;

    const fetchParameters = {
      method: HttpMethod.Delete,
    };
    const response = await fetch(url, fetchParameters);
    if (!response.ok)
      throw new Error(`Car not found (status: ${response.status})`);
    return true;
  }

  public static async updateCar(
    id: number,
    name: string,
    color: string
  ): Promise<ICar> {
    const carInfo = {
      name,
      color,
    };

    const url = `${baseURL}/garage/${id}`;

    const fetchBody = {
      method: HttpMethod.Put,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carInfo),
    };

    const response = await fetch(url, fetchBody);

    if (!response.ok) {
      throw new Error(`Failed to update car: ${response.statusText}`);
    }

    const updatedCar: unknown = await response.json();

    if (!ApiClient.isICar(updatedCar)) {
      throw new Error('Invalid car data received from server');
    }

    return updatedCar;
  }

  public static addSearchParams(
    url: URL,
    parameters?: IPaginationParameters
  ): URL {
    if (parameters) {
      for (const [key, value] of Object.entries(parameters)) {
        if (value) {
          url.searchParams.append(key, String(value));
        }
      }
    }
    return url;
  }
}
