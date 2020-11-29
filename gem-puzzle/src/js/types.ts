export interface MoveParams {
  // eventCoordinate: string;
  positionProperty: 'left' | 'top';
  offsetProperty: 'offsetLeft' | 'offsetTop';
  tilesDimansion: 'col' | 'row';
}

export interface EmptyCell {
  row: number;
  col: number;
}
