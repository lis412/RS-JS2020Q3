import Cell from './Cell';
import Timer from './Timer';
import * as tools from './utils/index';

const main = tools.create('main', '', [tools.create('h1', 'title', 'Puzzle game')]);

export default class GameField {
  constructor() {
    this.emptyCell = {
      col: 0,
      row: 0,
    };
  }

  init(size) {
    this.size = size;
    this.stepCount = 0;
    this.secondCount = 0;
    this.timer = new Timer();
    // create markdown
    this.stepField = tools.create('div', 'step', `${this.stepCount}`);
    this.timeField = tools.create('div', 'time', '00:00:00');

    tools.create('button', 'btn', 'Start new game', main).addEventListener('click', () => { this.generateCells(); });
    tools.create('button', 'btn', 'Pause', main).addEventListener('click', () => { this.timer.pause(); });
    tools.create('button', 'btn', 'Countinue', main).addEventListener('click', () => { this.timer.start(); });

    tools.create('div', 'score', [
      tools.create('span', '', 'Steps: '),
      this.stepField,
      tools.create('span', '', 'Time: '),
      this.timeField,
    ], main);

    this.timer
      .init(0, (timeString) => { this.timeField.innerHTML = timeString; })
      .start();

    this.field = tools.create('div', 'field', null, main);
    this.generateCells();
    // add to document
    document.body.prepend(main);
  }

  generateCells(data) {
    // если не передали начальное значение - генерируем новый массив
    const numbers = data || this.generateNumbers();

    // TODO проверить очистку прежних ячеек
    if (this.cells) {
      this.cells.forEach((cell) => cell.div.remove());
    }
    this.cells = [];

    for (let i = 0; i < numbers.length; i++) {
      const col = i % this.size;
      const row = (i - col) / this.size;
      if (numbers[i] === 0) {
        // init empty cell
        this.emptyCell.col = col;
        this.emptyCell.row = row;
      } else {
        // create cell with number
        const cell = new Cell(numbers[i], col, row);

        cell.div.addEventListener('click', () => {
          this.cellClickHandler(cell);
        });

        this.cells.push(cell);
        this.field.appendChild(cell.div);
      }
    }
  }

  cellClickHandler(cell) {
    cell.swapWithEmpty(this.emptyCell, () => {
      this.stepCount += 1;
      this.stepField.innerHTML = `${this.stepCount}`;

      if (this.checkWin()) {
        // временная заглушка, чтобы успел прорисоваться интерфейс
        setTimeout(this.showResults.bind(this), 500);
        // this.showResults();
      }
    });
  }

  checkWin() {
    return this.cells.reduce((result, cell) => result && cell.isSolved(this.size), true);
  }

  showResults() {
    this.timer.stop();
    console.log(`Ура! Вы решили головоломку за ${this.timer.getTimeString()} и ${this.stepCount} ходов`);
  }

  generateNumbers() {
    const numbers = [/* 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0 */];
    for (let i = 0; i < this.size * this.size; i++) {
      numbers.push(i);
    }
    tools.shuffle(numbers);
    if (!tools.isPuzzleSolvable(numbers)) {
      let i = 0;
      if (numbers[i] === 0 || numbers[i + 1] === 0) i = this.size * this.size - 2;
      [numbers[i], numbers[i + 1]] = [numbers[i + 1], numbers[i]];
    }
    return numbers;
  }
}
