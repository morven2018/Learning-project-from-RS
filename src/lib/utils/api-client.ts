import { ICar, IPaginationParameters } from '../types/api-interfaces';

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
    const cars = (await response.json()) as ICar[];
    return { cars, totalCount };
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
