import { ZERO } from './Const';

export function arrayCopy(source: number[][]): number[][] {
  return source.map((el) => el.slice(0));
}

export function exch(data: number[][], srcRow: number, srcCol: number, dstRow: number, dstCol: number): void {
  [data[srcRow][srcCol], data[dstRow][dstCol]] = [data[dstRow][dstCol], data[srcRow][srcCol]];
}

// export function calcManhattan(tiles: number[][], dimension: number): number {
//   let manhattanTmp = 0;
//   for (let row = 0; row < dimension; row++) {
//     for (let col = 0; col < dimension; col++) {
//       const cellValue = tiles[row][col];
//       if (cellValue !== ZERO) {
//         const colTmp = (cellValue - 1) % dimension;
//         const rowTmp = (cellValue - 1 - colTmp) / dimension;
//         manhattanTmp += Math.abs(rowTmp - row);
//         manhattanTmp += Math.abs(colTmp - col);
//       }
//     }
//   }
//   return manhattanTmp;
// }

export function solvable(tiles: number[]): boolean {
  let kDisorder = 0;
  const len = tiles.length - 1;
  // для каждого элемента массива
  for (let i = 1; i < len; i++) {
    if (tiles[i] !== ZERO) {
      // узнаём сколько предшествующих элементов больше текущего
      for (let j = i - 1; j >= 0; j--) {
        // если один из предыдущих элементов больше - накручиваем счетчик
        if (tiles[j] > tiles[i]) {
          kDisorder += 1;
        }
      }
    }
  }

  // если сумма вышла четной - комбинация имеет решение
  return !(kDisorder % 2);
}
