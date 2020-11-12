export default class Cell {
  constructor(num, col, row) {
    this.num = num;
    this.col = col;
    this.row = row;
  }

  generateCell() {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.innerHTML = this.num;
    return cell;
  }
}
