import { CELL_SIZE } from './Const';

export default class Cell {
  constructor(num, col, row) {
    this.num = num;
    this.col = col;
    this.row = row;

    this.generateDiv();
  }

  generateDiv() {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.innerHTML = this.num;
    this.div = cell;

    this.updatePosition();

    return cell;
  }

  updatePosition() {
    this.div.style.left = `${this.col * CELL_SIZE}px`;
    this.div.style.top = `${this.row * CELL_SIZE}px`;
  }

  swapWithEmpty(emptyCell, callback) {
    if (!this.canMove(emptyCell)) return;

    [this.col, this.row,
      emptyCell.col, emptyCell.row] = [
      emptyCell.col, emptyCell.row,
      this.col, this.row];

    this.updatePosition();

    if (callback) callback();
  }

  canMove(emptyCell) {
    return Math.abs(emptyCell.col - this.col)
      + Math.abs(emptyCell.row - this.row) === 1;
  }

  isSolved(size) {
    return (this.col + this.row * size) + 1 === this.num;
  }
}
