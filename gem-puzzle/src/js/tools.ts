export function arrayCopy(source: number[][]): number[][] {
  return source.map((el) => el.slice(0));
}

export function exch(data: number[][], srcRow: number, srcCol: number, dstRow: number, dstCol: number): void {
  [data[srcRow][srcCol], data[dstRow][dstCol]] = [data[dstRow][dstCol], data[srcRow][srcCol]];
}
