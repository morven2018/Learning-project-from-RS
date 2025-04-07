export interface IPaginationParameters {
  _page?: number;
  _limit?: number;
}

export interface ICar {
  id: number;
  name: string;
  color: string;
}
export interface ICarCreate {
  name: string;
  color: string;
}
