import { ZERO } from './Const';

export function arrayCopy(source: number[][]): number[][] {
  return source.map((el) => el.slice(0));
}

export function exch(data: number[][], srcRow: number, srcCol: number, dstRow: number, dstCol: number): void {
  [data[srcRow][srcCol], data[dstRow][dstCol]] = [data[dstRow][dstCol], data[srcRow][srcCol]];
}

export function solvable(tiles: number[][]): boolean {
  function getInvCount(arr: number[]): number {
    let inversionsCount = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        // count pairs(i, j) such that i appears
        // before j, but i > j.
        if (arr[j] && arr[i] && arr[i] > arr[j]) inversionsCount += 1;
      }
    }
    return inversionsCount;
  }

  // find Position of blank from bottom
  function findXPosition(puzzle: number[][]): number {
    // start from bottom-right corner of matrix
    for (let i = puzzle.length - 1; i >= 0; i--) {
      for (let j = puzzle.length - 1; j >= 0; j--) {
        if (puzzle[i][j] === ZERO) return puzzle.length - i;
      }
    }
    return 0;
  }

  // Count inversions in given puzzle
  const invCount = getInvCount(tiles.flat());

  // If grid is odd, return true if inversion
  // count is even.
  if (tiles.length % 2) {
    return !(invCount % 2);
  }
  const pos = findXPosition(tiles);
  if (pos % 2) return !(invCount % 2);
  return Boolean(invCount % 2);
}
