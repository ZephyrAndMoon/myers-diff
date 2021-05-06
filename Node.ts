export abstract class PathNode {
  public i: number;
  public j: number;
  public prev: PathNode;

  constructor(i: number, j: number, prev: PathNode) {
    this.i = i;
    this.j = j;
    this.prev = prev;
  }

  abstract isSnake(): boolean;

  public toString(): string {
    let buf: string = "[";
    let node: PathNode = this;
    while (node) {
      buf += "(";
      buf += node.i.toString();
      buf += ",";
      buf += node.j.toString();
      buf += ")";
      node = node.prev;
    }
    buf += "]";
    return buf.toString();
  }
}

export class Snake extends PathNode {
  constructor(i: number, j: number, prev: PathNode) {
    super(i, j, prev);
  }

  public isSnake(): boolean {
    return true;
  }
}

export class DiffNode extends PathNode {
  constructor(i: number, j: number, prev: PathNode) {
    super(i, j, prev);
  }

  public isSnake(): boolean {
    return false;
  }
}
