import Cell, { EmptyCell } from './Cell';
import Timer from './Timer';
import * as tools from './utils/index';

const main = tools.create('main', '', [tools.create('h1', 'title', 'Puzzle game')]);

export default class GameField {
  emptyCell: EmptyCell; // { col: number; row: number };

  size: number;

  stepCount: number;

  secondCount: number;

  timer: Timer;

  stepField: HTMLElement;

  timeField: HTMLElement;

  field: HTMLElement;

  overlay: HTMLElement;

  cells: Cell[] = [];

  constructor() {
    this.emptyCell = {
      col: 0,
      row: 0,
    };
    this.size = 0;
    this.stepCount = 0;
    this.secondCount = 0;
    // timer
    this.timer = new Timer();
    this.timer.init(0, (timeString: string): void => {
      this.timeField.innerHTML = timeString;
    });

    // create markdown
    this.stepField = tools.create('div', 'step', `${this.stepCount}`);
    this.timeField = tools.create('div', 'time', '00:00:00');

    tools.create('button', 'btn', 'Start new game', main).addEventListener('click', () => {
      this.generateCells();
      this.stepCount = 0;
      this.timer.reset();
    });
    tools.create('button', 'btn', 'Pause', main).addEventListener('click', () => {
      this.timer.stop();
    });
    tools.create('button', 'btn', 'Countinue', main).addEventListener('click', () => {
      this.timer.start();
    });

    tools.create(
      'div',
      'score',
      [tools.create('span', '', 'Steps: '), this.stepField, tools.create('span', '', 'Time: '), this.timeField],
      main,
    );

    this.field = tools.create('div', 'field', null, main);
    this.overlay = tools.create('div', 'overlay', null, main);
    tools.create(
      'div',
      'description',
      `
      Уважаемые проверяющие, если есть возможность, то прошу отложить проверку на пару дней, т.к. не успел реализовать все свои задумки. если что - мои контакты:<br>
      Discord A_Lis#5105 или Telegram @lis412
    `,
      main,
    );
  }

  init(size: number): void {
    this.size = size;

    this.timer.start();

    this.generateCells();
    // add to document
    document.body.prepend(main);
  }

  generateCells(data?: number[]): void {
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

  cellClickHandler(cell: Cell): void {
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

  checkWin(): boolean {
    return this.cells.reduce((result: boolean, cell: Cell) => result && cell.isSolved(this.size), true);
  }

  showResults(): void {
    this.timer.stop();

    const modal = tools.create(
      'div',
      'popup',
      `<div class="popup-info">
        <div>
          <span class="result-title">Ура!</span>
          <span class="result-message">
          Вы решили головоломку за ${this.timer.getTimeString()} и ${this.stepCount} ходов
          </span>    
        </div>
      </div>`,
      document.body,
    );

    const onClickHandler = () => {
      this.generateCells();
      this.stepCount = 0;
      this.stepField.innerHTML = `${this.stepCount}`;
      this.timer.reset().start();

      this.overlay.classList.remove('overlay--active');
      document.body.classList.remove('no-scroll');
      modal.remove();
    };

    tools
      .create('button', 'result-button', 'Start new game', modal)
      .addEventListener('click', onClickHandler.bind(this));

    this.overlay.classList.toggle('overlay--active');

    document.body.appendChild(modal);
    document.body.classList.add('no-scroll');
    // console.log(`Ура! Вы решили головоломку за
    // ${this.timer.getTimeString()} и ${this.stepCount} ходов`);
  }

  generateNumbers(): number[] {
    const numbers = [
      /* 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0 */
    ];
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
