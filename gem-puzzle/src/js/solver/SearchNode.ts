import Board from './Board';

export default class SearchNode {
  public board: Board;

  public prevNode: SearchNode | null;

  public moves: number;

  constructor(board: Board, moves: number, prevNode: SearchNode | null) {
    this.board = board;
    this.prevNode = prevNode;
    this.moves = moves;
  }

  public manhattanPriority(): number {
    return this.moves + this.board.manhattan;
  }

  public isGoal(): boolean {
    return this.board.isGoal();
  }
}
