import Cell, { EmptyCell } from './Cell';
import { SAVED_GAME_KEY, ZERO } from './Const';
import Board from './solver/Board';
import Solver from './solver/Solver';
import Timer from './Timer';
import { exch, solvable } from './tools';
import * as tools from './utils/index';

const main = tools.create('main', '', [tools.create('h1', 'title', 'Puzzle game')]);

export default class GameField {
  emptyCell: EmptyCell = {
    col: 0,
    row: 0,
  }; // { col: number; row: number };
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
      this.startNewGame();
    });
    tools.create('button', 'btn', 'Pause', main).addEventListener('click', () => {
      this.timer.stop();
    });
    tools.create('button', 'btn', 'Countinue', main).addEventListener('click', () => {
      this.timer.start();
    });
    tools.create('button', 'btn', 'Solve', main).addEventListener('click', () => {
      this.solvePuzzle();
    });
    tools.create('button', 'btn', 'Save', main).addEventListener('click', () => {
      this.saveGame();
    });
    tools.create('button', 'btn', 'Load', main).addEventListener('click', () => {
      this.loadGame();
    });

    tools.create(
      'div',
      'score',
      [tools.create('span', '', 'Steps: '), this.stepField, tools.create('span', '', 'Time: '), this.timeField],
      main,
    );

    this.field = tools.create('div', 'field', null, main);
    this.overlay = tools.create('div', 'overlay', null, main);
  }

  private startNewGame() {
    this.generateCells();
    this.stepCount = 0;
    this.timer.reset();
  }

  init(size: number): void {
    this.size = size;

    this.timer.start();

    this.generateCells();
    // add to document
    document.body.prepend(main);
  }

  generateCells(data?: number[][]): void {
    // если не передали начальное значение - генерируем новый массив
    const numbers = data || GameField.generateNumbers(this.size);

    // TODO проверить очистку прежних ячеек
    // if (this.cells.length) {
    //   this.cells.forEach((cell) => cell.div.remove());
    // }
    this.cells.forEach((cell) => cell.div.remove());
    this.cells = [];

    for (let row = 0; row < numbers.length; row++) {
      for (let col = 0; col < numbers.length; col++) {
        const cellValue = numbers[row][col];
        if (cellValue === 0) {
          // init empty cell
          this.emptyCell = { col, row };
          // this.emptyCell.col = col;
          // this.emptyCell.row = row;
        } else {
          // create cell with number
          const cell = new Cell(cellValue, row, col);

          cell.div.addEventListener('click', () => {
            this.cellClickHandler(cell);
          });

          this.cells.push(cell);
          this.field.appendChild(cell.div);
        }
      }
    }
  }

  cellClickHandler(cell?: Cell): void {
    cell?.swapWithEmpty(this.emptyCell, () => {
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
    return this.cells.every((cell) => cell.isSolved(this.size));
    // return this.cells.reduce((result: boolean, cell: Cell) => result && cell.isSolved(this.size), true);
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

  static generateNumbers(dimension: number): number[][] {
    const numbers = [
      // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0
    ];
    for (let i = 0; i < dimension * dimension; i++) {
      numbers.push(i);
    }
    tools.shuffle(numbers);

    const result: number[][] = [];
    let empty: EmptyCell = { row: 0, col: 0 };
    for (let row = 0; row < dimension; row++) {
      result[row] = [];
      for (let col = 0; col < dimension; col++) {
        result[row][col] = numbers[row * dimension + col];
        if (result[row][col] === ZERO) {
          empty = { row, col };
        }
      }
    }
    if (!solvable(numbers)) {
      if (empty.row === 0) {
        exch(result, 1, 0, 1, 1);
      } else {
        exch(result, 0, 0, 0, 1);
      }
    }

    return result;
  }

  solvePuzzle(): void {
    const numbers: number[][] = this.extractNumbersArr();
    const startBoard = new Board(numbers);
    const solver = new Solver(startBoard);

    const loopTask = (i: number, board: Board) => {
      setTimeout(() => {
        const cell = this.cellAtPos(board.emptyCol, board.emptyRow);
        this.cellClickHandler(cell);
      }, 500 * i);
    };

    if (solver.isSolvable) {
      let i = 0;
      let board = solver.solution.pop();
      while (board) {
        loopTask(i, board);
        board = solver.solution.pop();
        i += 1;
      }
      // solver.solution.forEach((board, index) => {
      //   loopTask(index, board);
      // });
    } else {
      // TODO replace with normal message
      alert(`can't solve!`);
    }
  }

  private extractNumbersArr() {
    const numbers: number[][] = [];
    for (let i = 0; i < this.size; i++) {
      numbers[i] = [];
    }
    this.cells.forEach((cell) => {
      numbers[cell.row][cell.col] = cell.num;
    }, []);
    numbers[this.emptyCell.row][this.emptyCell.col] = 0;
    return numbers;
  }

  cellAtPos(col: number, row: number): Cell | undefined {
    return this.cells.find((cell) => cell.col === col && cell.row === row);
  }

  saveGame(): void {
    // save game to local storage
    const numbers: number[][] = this.extractNumbersArr();
    tools.setToStorage(SAVED_GAME_KEY, numbers);
  }

  loadGame(): boolean {
    // TODO add confirmation dialog.
    const numbers = tools.getFromStorage(SAVED_GAME_KEY);
    if (numbers) {
      this.generateCells(numbers);
      this.stepCount = 0;
      this.timer.reset();
      return true;
    }
    return false;
  }
}
