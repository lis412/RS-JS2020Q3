import Cell from './Cell';
// import { CELL_SIZE } from './Const';
import create from './utils/create';
import isPuzzleSolvable from './utils/isPuzzleSolvable';
import shuffle from './utils/shuffle';

const main = create('main', '', [create('h1', 'title', 'Puzzle game')]);

export default class GameField {
  constructor() {
    this.emptyCell = {
      col: 0,
      row: 0,
    };
    this.stepCount = 0;
  }

  init(size) {
    this.cells = [];
    this.size = size;
    // create markdown
    this.field = create('div', 'field', null, main);
    this.stepField = create('div', 'step', `${this.stepCount}`);

    create('div', 'score', [
      create('span', '', 'Steps: '),
      this.stepField,
    ], main);

    const numbers = this.generateNumbers();

    for (let i = 0; i < numbers.length; i++) {
      const col = i % size;
      const row = (i - col) / size;
      if (numbers[i] === 0) {
        // init empty cell
        this.emptyCell.col = col;
        this.emptyCell.row = row;
      } else {
        const cell = new Cell(numbers[i], col, row);

        this.cells.push(cell);

        cell.div.addEventListener('click', () => {
          cell.swapWithEmpty(this.emptyCell, () => {
            this.stepCount += 1;
            this.stepField.innerHTML = `${this.stepCount}`;

            if (this.checkWin()) {
              setTimeout(this.showResults, 500);
              // this.showResults();
            }
          });
        });

        this.field.appendChild(cell.div);
      }
    }
    // add to document
    document.body.prepend(main);
  }

  checkWin() {
    return this.cells.reduce((result, cell) => result && cell.isSolved(this.size), true);
  }

  showResults() {
    console.log(`Ура! Вы решили головоломку за #:## и ${this.stepCount} ходов`);
  }

  generateNumbers() {
    const numbers = [];
    for (let i = 0; i < this.size * this.size; i++) {
      numbers.push(i);
    }
    shuffle(numbers);
    if (!isPuzzleSolvable(numbers)) {
      let i = 0;
      if (numbers[i] === 0 || numbers[i + 1] === 0) i = this.size * this.size - 2;
      [numbers[i], numbers[i + 1]] = [numbers[i + 1], numbers[i]];
    }
    return numbers;
  }
}
