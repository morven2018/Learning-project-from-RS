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
export interface ICarAnimationState {
  isRunning: boolean;
  progress: number;
  startTime: number | null;
}
export interface ICarRaceParameters {
  velocity: number;
  distance: number;
}
