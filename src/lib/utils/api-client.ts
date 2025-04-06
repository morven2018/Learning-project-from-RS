import type { ICar, IPaginationParameters } from '../types/api-interfaces';
import { HttpMethod } from '../types/enums';

const baseURL = 'http://127.0.0.1:3000';

export class ApiClient {
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
    const cars = await response.json();
    return { cars, totalCount };
  }

  public static isICar(value: unknown): value is ICar {
    return (
      typeof value === 'object' &&
      value !== null &&
      'id' in value &&
      typeof value.id === 'number' &&
      'name' in value &&
      typeof value.name === 'string' &&
      'color' in value &&
      typeof value.color === 'string'
    );
  }

  public static async getCar(id: number): Promise<ICar> {
    const url = `${baseURL}/garage/${id}`;
    try {
      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`Car not found (status: ${response.status})`);

      const car: unknown = await response.json();

      if (car && typeof car === 'object' && ApiClient.isICar(car)) return car;
      throw new Error('Parsing error');
    } catch (error) {
      console.error(error);
    }
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
    return response.json();
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
    if (!response.ok)
      throw new Error(`Car not found (status: ${response.status})`);

    return response.json();
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
