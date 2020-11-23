import { ZERO } from '../Const';
import * as tools from '../tools';
// interface BoardInterface

const enum Direction {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}

export default class Board {
  private dimension = 0;

  private tiles: number[][];

  private emptyRow = 0;

  private emptyCol = 0;

  private hamming = 0;

  public manhattan = 0;

  // create a board from an n-by-n array of tiles,
  // where tiles[row][col] = tile at (row, col)
  constructor(tiles: number[][]) {
    let hammingTmp = 0;
    let manhattanTmp = 0;
    let rowTmp;
    let colTmp;

    this.dimension = tiles.length;
    this.tiles = [];
    for (let i = 0; i < this.dimension; i++) {
      for (let j = 0; j < this.dimension; j++) {
        this.tiles[i][j] = tiles[i][j];
        /* get pos for ZERO */
        if (tiles[i][j] === ZERO) {
          this.emptyRow = i;
          this.emptyCol = j;
        }
        /* calc hamming */
        if (tiles[i][j] !== ZERO && tiles[i][j] !== i * this.dimension + j + 1) {
          hammingTmp += 1;
        }
        /* calc manhattan */
        if (tiles[i][j] !== ZERO) {
          rowTmp = (tiles[i][j] - 1) / this.dimension;
          colTmp = (tiles[i][j] - 1) % this.dimension;
          manhattanTmp += Math.abs(rowTmp - i);
          manhattanTmp += Math.abs(colTmp - j);
        }
      }
    }
    this.manhattan = manhattanTmp;
    this.hamming = hammingTmp;
  }

  // is this board the goal board?
  public isGoal(): boolean {
    return this.manhattan === 0;
  }

  // does this board equal y?
  public equals(that: Board): boolean {
    if (that == null) return false;
    if (that === this) return true;
    if (this.dimension !== that.dimension) return false;
    for (let i = 0; i < this.dimension; i++) {
      for (let j = 0; j < this.dimension; j++) {
        if (this.tiles[i][j] !== that.tiles[i][j]) return false;
      }
    }
    return true;
  }

  // all neighboring boards
  public neighbors(): Array<Board> {
    const neighbors = new Array<Board>(this.dimension);
    let neighbor: Board | null;
    const directions = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
    directions.forEach((direction) => {
      neighbor = this.getNeighbor(direction);
      if (neighbor) {
        neighbors.push(neighbor);
      }
    });
    return neighbors;
  }

  private getNeighbor(direction: Direction): Board | null {
    let tilesCopy: number[][];
    switch (direction) {
      case Direction.LEFT:
        if (this.emptyCol === 0) {
          return null;
        }
        tilesCopy = tools.arrayCopy(this.tiles);
        tools.exch(tilesCopy, this.emptyRow, this.emptyCol, this.emptyRow, this.emptyCol - 1);
        return new Board(tilesCopy);

      case Direction.UP:
        if (this.emptyRow === 0) {
          return null;
        }
        tilesCopy = tools.arrayCopy(this.tiles);
        tools.exch(tilesCopy, this.emptyRow, this.emptyCol, this.emptyRow - 1, this.emptyCol);
        return new Board(tilesCopy);

      case Direction.RIGHT:
        if (this.emptyCol === this.dimension - 1) {
          return null;
        }
        tilesCopy = tools.arrayCopy(this.tiles);
        tools.exch(tilesCopy, this.emptyRow, this.emptyCol, this.emptyRow, this.emptyCol + 1);
        return new Board(tilesCopy);

      case Direction.DOWN:
        if (this.emptyRow === this.dimension - 1) {
          return null;
        }
        tilesCopy = tools.arrayCopy(this.tiles);
        tools.exch(tilesCopy, this.emptyRow, this.emptyCol, this.emptyRow + 1, this.emptyCol);
        return new Board(tilesCopy);

      default:
        return null;
    }
  }

  // private arrayCopy(source: number[][]): number[][] {
  //   return source.map((el) => el.slice(0));
  // }

  // private exch(data: number[][], srcRow: number, srcCol: number, dstRow: number, dstCol: number) {
  //   [data[srcRow][srcCol], data[dstRow][dstCol]] = [data[dstRow][dstCol], data[srcRow][srcCol]];
  // }
}
