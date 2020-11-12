import Cell from './Cell';
import { CELL_SIZE } from './Const';
import create from './utils/create';

const main = create('main', '', [create('h1', 'title', 'Puzzle game')]);

export default class GameField {
  // constructor() {
  //   // super();
  // }

  init(size) {
    this.size = size;
    this.field = create('div', 'field', null, main);

    for (let i = 0; i < size * size - 1; i++) {
      const col = i % size;
      const row = (i - col) / size;
      const cell = new Cell(i + 1, col, row).generateCell();

      cell.style.left = `${col * CELL_SIZE}px`;
      cell.style.top = `${row * CELL_SIZE}px`;

      this.field.appendChild(cell);
    }
    document.body.prepend(main);
  }
}
