export enum CssClasses {
  Header = 'header',
  Main = 'main',
  Garage = 'garage',
  Winners = 'winners',
  NotFound = 'not-found',
  ToGarage = 'btn-to-garage',
  ToWinners = 'btn-to-winners',
  Disable = 'disable',
  FormAdd = 'form-add-car',
  FormUpdate = 'form-update-car',
  InputName = 'car-name',
  InputColor = 'color',
  H1 = 'header-info',
  Race = 'race-btn',
  Reset = 'reset-btn',
  Generate = 'generate-btn',
  GarageList = 'list-of-cars',
  Element = 'list-element',
  Select = 'select-btn',
  Delete = 'delete-bth',
  NameArea = 'name-of-car',
  RaceArea = 'race-area',
  RaceButton = 'race-btns',
  Start = 'start-btn',
  Stop = 'stop-btn',
  RaceTrack = 'race-track',
  Pagination = 'pagination',
  PaginationButton = 'pagination-btn',
  PaginationEllipsis = 'pagination-ellipsis',
  ActivePage = 'current-page',
  Table = 'winner-table',
  Caption = 'page',
  Tr = 'table-row',
  Th = 'table-header-element',
  Thead = 'table-header',
  Tbody = 'table-content',
}

export enum CssTags {
  Main = 'main',
  Header = 'header',
  Section = 'section',
  Button = 'button',
  Form = 'form',
  Input = 'input',
  H1 = 'h1',
  Ul = 'ul',
  Li = 'li',
  Div = 'div',
  Race = 'canvas',
  Span = 'span',
  Table = 'table',
  Caption = 'caption',
  Tr = 'tr',
  Thead = 'thead',
  Th = 'th',
  Tbody = 'tbody',
  Td = 'td',
}

export enum Pages {
  Garage = 'garage',
  Winners = 'winners',
  Notfound = 'not-found',
}

export enum HttpMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Patch = 'PATCH',
  Delete = 'DELETE',
}

export enum Colors {
  ReserveFinishColor = '#ff0000',
  Yellow = '#FFD700',
  Orange = '#FFA500',
  Ochre = '#FF8C00',
}

export enum Track {
  DashHeight = 4,
  TrackGap = 3,
  TrackDash = 15,
  Padding = 5,
  FinishSize = 50,
  FinishLine = 120,
  FinishDelta = 0.24 * 50,
}
export enum Car {
  CarWidth = 100,
  WheelOffset = 2,
  DefaultCarSpeed = 0.002,
  WheelSizeRatio = 0.13,
  BrokeSize = 15,
}

export enum PaginationButtons {
  Previous = '←',
  Next = '→',
  Ellipsis = '...',
}

export enum TableHeader {
  Id = '#ID',
  IdClass = 'id',
  Car = 'CAR',
  Wins = 'WINS🏆',
  WinsClass = 'wins',
  Time = 'BEST TIME⌛ (sec)',
  TimeClass = 'time',
}

export enum SortBy {
  Id = 'id',
  Wins = 'wins',
  Time = 'time',
}
export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC',
}
