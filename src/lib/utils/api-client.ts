import { ICar, IPaginationParameters } from '../types/api-interfaces';
import { HttpMethod } from '../types/enums';

const baseURL = 'http://127.0.0.1:3000';

export class ApiClient {
  public static async getCars(
    params?: IPaginationParameters
  ): Promise<{ cars: ICar[]; totalCount: number }> {
    let url = new URL(`${baseURL}/garage`);
    url = ApiClient.addSearchParams(url, params);

    const response = await fetch(url);
    const totalCount = parseInt(
      response.headers.get('X-Total-Count') || '0',
      10
    );
    const cars = await response.json();
    return { cars, totalCount };
  }

  public static async getCar(id: number): Promise<ICar> {
    let url = `${baseURL}/garage/${id}`;

    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Car not found (status: ${response.status})`);

    const car = await response.json();
    return car;
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
    let url = `${baseURL}/garage/${id}`;

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

    let url = `${baseURL}/garage/${id}`;

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

  public static addSearchParams(url: URL, params?: IPaginationParameters): URL {
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url;
  }
}
