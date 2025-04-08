import type {
  ICar,
  IPaginationParameters,
  ICarRaceParameters,
  IWinner,
  IWinnerUpdate,
  IWinnerCreate,
} from '../types/api-interfaces';
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

    try {
      await this.deleteWinner(id);
    } catch (error) {
      if (!(error instanceof Error && error.message.includes('404'))) {
        console.error(`Winner not found`, error);
      }
    }

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

  public static async toggleEngine(
    id: number,
    status: 'started' | 'stopped'
  ): Promise<ICarRaceParameters> {
    const url = new URL(`${baseURL}/engine`);
    url.searchParams.append('id', id.toString());
    url.searchParams.append('status', status);

    const response = await fetch(url.toString(), {
      method: HttpMethod.Patch,
    });

    if (!response.ok) {
      throw new Error(`Failed to ${status} engine: ${response.statusText}`);
    }

    const engineData: unknown = await response.json();

    if (!ApiClient.isIEngineParameters(engineData)) {
      throw new Error('Invalid engine data received from server');
    }

    return engineData;
  }

  public static async switchToDrive(id: number): Promise<void> {
    const response = await fetch(`${baseURL}/engine?id=${id}&status=drive`, {
      method: 'PATCH',
    });

    if (response.status === 429) {
      throw new Error('429: Too Many Requests');
    }
    if (!response.ok) {
      throw new Error(`Failed to switch to drive: ${response.statusText}`);
    }
  }

  public static async getWinners(
    parameters?: IPaginationParameters & {
      _sort?: 'id' | 'wins' | 'time';
      _order?: 'ASC' | 'DESC';
    }
  ): Promise<{ winners: IWinner[]; totalCount: number }> {
    let url = new URL(`${baseURL}/winners`);
    url = ApiClient.addSearchParams(url, parameters);

    const response = await fetch(url);
    const totalCount = Number(response.headers.get('X-Total-Count') || '0');
    const winners: unknown = await response.json();

    if (
      !Array.isArray(winners) ||
      !winners.every((winner) => this.isIWinner(winner))
    ) {
      throw new Error('Invalid winners data received from server');
    }

    return { winners, totalCount };
  }

  public static async getWinner(id: number): Promise<IWinner> {
    const url = `${baseURL}/winners/${id}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Winner not found (status: ${response.status})`);
    }

    const winner: unknown = await response.json();
    if (!ApiClient.isIWinner(winner)) {
      throw new Error('Invalid winner data received from server');
    }

    return winner;
  }

  public static async createWinner(
    winnerData: IWinnerCreate
  ): Promise<IWinner> {
    const url = `${baseURL}/winners`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(winnerData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create winner: ${response.statusText}`);
    }

    const createdWinner: unknown = await response.json();
    if (!ApiClient.isIWinner(createdWinner)) {
      throw new Error('Invalid winner data received from server');
    }

    return createdWinner;
  }

  public static async updateWinner(
    id: number,
    winnerData: IWinnerUpdate
  ): Promise<IWinner> {
    const url = `${baseURL}/winners/${id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(winnerData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update winner: ${response.statusText}`);
    }

    const updatedWinner: unknown = await response.json();
    if (!ApiClient.isIWinner(updatedWinner)) {
      throw new Error('Invalid winner data received from server');
    }

    return updatedWinner;
  }

  public static async deleteWinner(id: number): Promise<void> {
    const url = `${baseURL}/winners/${id}`;
    const response = await fetch(url, { method: 'DELETE' });

    if (!response.ok) {
      throw new Error(`Failed to delete winner: ${response.statusText}`);
    }
  }

  public static async saveRaceResult(
    winnerId: number,
    winnerTime: number
  ): Promise<IWinner> {
    try {
      const existingWinner = await ApiClient.getWinner(winnerId);
      const bestTime = Math.min(existingWinner.time, winnerTime);

      return await ApiClient.updateWinner(winnerId, {
        wins: existingWinner.wins + 1,
        time: bestTime,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return await ApiClient.createWinner({
          id: winnerId,
          wins: 1,
          time: winnerTime,
        });
      }
      throw error;
    }
  }

  private static isIWinner(winner: unknown): winner is IWinner {
    if (typeof winner !== 'object' || !winner) return false;
    return 'id' in winner && 'wins' in winner && 'time' in winner;
  }

  private static isIEngineParameters(
    data: unknown
  ): data is ICarRaceParameters {
    if (typeof data !== 'object' || !data) {
      return false;
    }
    return (
      'velocity' in data &&
      typeof data.velocity === 'number' &&
      'distance' in data &&
      typeof data.distance === 'number'
    );
  }
}
