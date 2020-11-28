import { CELL_SIZE } from './Const';
import soundfile from '../assets/sounds/tink.wav';

export interface EmptyCell {
  row: number;
  col: number;
}

export default class Cell {
  num: number;
  col: number;
  row: number;
  div: HTMLDivElement;

  constructor(num: number, row: number, col: number) {
    this.num = num;
    this.col = col;
    this.row = row;

    this.div = this.generateDiv();
    this.div.addEventListener('click', Cell.playSound);
    this.updatePosition();
  }

  generateDiv(): HTMLDivElement {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.innerHTML = String(this.num);
    return cell;
  }

  updatePosition(): void {
    this.div.style.left = `${this.col * CELL_SIZE}px`;
    this.div.style.top = `${this.row * CELL_SIZE}px`;
  }

  swapWithEmpty(emptyCell: EmptyCell, callback: () => void): void {
    if (!this.canMove(emptyCell)) return;

    [this.col, this.row, emptyCell.col, emptyCell.row] = [emptyCell.col, emptyCell.row, this.col, this.row];

    this.updatePosition();

    if (callback) callback();
  }

  canMove(emptyCell: EmptyCell): boolean {
    return Math.abs(emptyCell.col - this.col) + Math.abs(emptyCell.row - this.row) === 1;
  }

  isSolved(size: number): boolean {
    return this.col + this.row * size + 1 === this.num;
  }

  static playSound(): void {
    const audio = new Audio(soundfile);
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  }
}
