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
  public emptyRow = 0;
  public emptyCol = 0;
  public manhattan = 0;

  // create a board from an n-by-n array of tiles,
  // where tiles[row][col] = tile at (row, col)
  constructor(tiles: number[][]) {
    // let hammingTmp = 0;
    let manhattanTmp = 0;
    // let rowTmp;
    // let colTmp;

    this.dimension = tiles.length;
    this.tiles = [];

    this.tiles = tools.matrixCopy(tiles);

    manhattanTmp = this.calcManhattan();
    this.manhattan = manhattanTmp;
  }

  private calcManhattan(): number {
    let manhattanTmp = 0;
    for (let row = 0; row < this.dimension; row++) {
      // this.tiles[row] = [];
      for (let col = 0; col < this.dimension; col++) {
        // this.tiles = tools.arrayCopy(tiles);
        const cellValue = this.tiles[row][col];
        // this.tiles[row][col] = cellValue;
        /* get pos for ZERO */
        if (cellValue === ZERO) {
          this.emptyRow = row;
          this.emptyCol = col;
        } else {
          /* calc manhattan */
          const colTmp = (cellValue - 1) % this.dimension;
          const rowTmp = (cellValue - 1 - colTmp) / this.dimension;
          // rowTmp = Math.floor((cellValue - 1) / this.dimension);
          // colTmp = (cellValue - 1) % this.dimension;
          manhattanTmp += Math.abs(rowTmp - row);
          manhattanTmp += Math.abs(colTmp - col);
        }
      }
    }
    return manhattanTmp;
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
    for (let row = 0; row < this.dimension; row++) {
      for (let col = 0; col < this.dimension; col++) {
        if (this.tiles[row][col] !== that.tiles[row][col]) return false;
      }
    }
    return true;
  }

  // all neighboring boards
  public neighbors(): Array<Board> {
    const neighbors: Board[] = [];
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
        tilesCopy = tools.matrixCopy(this.tiles);
        tools.swapMatrixItems(tilesCopy, this.emptyRow, this.emptyCol, this.emptyRow, this.emptyCol - 1);
        return new Board(tilesCopy);

      case Direction.UP:
        if (this.emptyRow === 0) {
          return null;
        }
        tilesCopy = tools.matrixCopy(this.tiles);
        tools.swapMatrixItems(tilesCopy, this.emptyRow, this.emptyCol, this.emptyRow - 1, this.emptyCol);
        return new Board(tilesCopy);

      case Direction.RIGHT:
        if (this.emptyCol === this.dimension - 1) {
          return null;
        }
        tilesCopy = tools.matrixCopy(this.tiles);
        tools.swapMatrixItems(tilesCopy, this.emptyRow, this.emptyCol, this.emptyRow, this.emptyCol + 1);
        return new Board(tilesCopy);

      case Direction.DOWN:
        if (this.emptyRow === this.dimension - 1) {
          return null;
        }
        tilesCopy = tools.matrixCopy(this.tiles);
        tools.swapMatrixItems(tilesCopy, this.emptyRow, this.emptyCol, this.emptyRow + 1, this.emptyCol);
        return new Board(tilesCopy);

      default:
        return null;
    }
  }

  public twin(): Board {
    const tilesCopy = tools.matrixCopy(this.tiles);
    if (this.emptyRow === 0) {
      tools.swapMatrixItems(tilesCopy, 1, 0, 1, 1);
    } else {
      tools.swapMatrixItems(tilesCopy, 0, 0, 0, 1);
    }
    return new Board(tilesCopy);
  }

  // private arrayCopy(source: number[][]): number[][] {
  //   return source.map((el) => el.slice(0));
  // }

  // private exch(data: number[][], srcRow: number, srcCol: number, dstRow: number, dstCol: number) {
  //   [data[srcRow][srcCol], data[dstRow][dstCol]] = [data[dstRow][dstCol], data[srcRow][srcCol]];
  // }
}
