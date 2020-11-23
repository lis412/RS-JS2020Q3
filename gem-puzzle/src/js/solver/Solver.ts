import PriorityQueue from 'ts-priority-queue';
import Board from './Board';
import SearchNode from './SearchNode';

export default class Solver {
  public isSolvable: boolean;

  public solution: Array<Board>;

  private ManhattanComparator = (first: SearchNode, second: SearchNode) => {
    return first.manhattanPriority() - second.manhattanPriority();
  };

  // find a solution to the initial board (using the A* algorithm)
  constructor(initial: Board) {
    const pq = new PriorityQueue({ comparator: this.ManhattanComparator });
    const twinPq = new PriorityQueue({ comparator: this.ManhattanComparator });
    this.solution = new Array<Board>();

    pq.queue(new SearchNode(initial, 0, null));
    twinPq.queue(new SearchNode(initial.twin(), 0, null)); // avoiding endless loop

    let currNode: SearchNode | null = pq.dequeue(); // SearchNode
    let twinCurrNode: SearchNode | null = twinPq.dequeue();

    while (!(currNode.isGoal() || twinCurrNode.isGoal())) {
      for (const neighbor of currNode.board.neighbors()) {
        if (currNode.prevNode == null || !neighbor.equals(currNode.prevNode.board)) {
          pq.queue(new SearchNode(neighbor, currNode.moves + 1, currNode));
        }
      }
      currNode = pq.dequeue();

      for (const neighbor of twinCurrNode.board.neighbors()) {
        if (twinCurrNode.prevNode == null || !neighbor.equals(twinCurrNode.prevNode.board)) {
          twinPq.queue(new SearchNode(neighbor, twinCurrNode.moves + 1, twinCurrNode));
        }
      }
      twinCurrNode = twinPq.dequeue();
    }

    this.isSolvable = currNode.isGoal();
    if (this.isSolvable) {
      do {
        this.solution.push(currNode.board);
        currNode = currNode.prevNode;
      } while (currNode != null);
    }
  }

  // min number of moves to solve initial board; -1 if unsolvable
  public moves(): number {
    if (this.isSolvable) {
      return this.solution.length - 1;
    }
    return -1;
  }
}
