import PriorityQueue from 'ts-priority-queue';
import Board from './Board';
import SearchNode from './SearchNode';

export default class Solver {
  private isSolvable: boolean;

  private solution: Array<Board>;

  private ManhattanComparator = (first: SearchNode, second: SearchNode) => {
    return first.manhattanPriority() - second.manhattanPriority();
  };

  // find a solution to the initial board (using the A* algorithm)
  constructor(initial: Board) {
    const pq = new PriorityQueue({ comparator: this.ManhattanComparator });
    this.solution = new Array<Board>();

    pq.queue(new SearchNode(initial, 0, null));

    let currNode: SearchNode | null = pq.dequeue(); // SearchNode

    while (currNode && !currNode.isGoal()) {
      for (const neighbor of currNode.board.neighbors()) {
        if (currNode.prevNode == null || !neighbor.equals(currNode.prevNode.board)) {
          pq.queue(new SearchNode(neighbor, currNode.moves + 1, currNode));
        }
      }
      // currNode.board.neighbors().forEach((neighbor) => {
      //   if (currNode.prevNode == null || !neighbor.equals(currNode.prevNode.board)) {
      //     pq.queue(new SearchNode(neighbor, currNode.moves + 1, currNode));
      //   }
      // });
      currNode = pq.dequeue();
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
