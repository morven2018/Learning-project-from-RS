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

export interface IWinner {
  id: number;
  wins: number;
  time: number;
}

export interface IWinnerCreate {
  id: number;
  wins: number;
  time: number;
}

export interface IWinnerUpdate {
  wins?: number;
  time?: number;
}
