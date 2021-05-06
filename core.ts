import { DiffNode, PathNode, Snake } from "./Node";

export class MyersDiff {
  constructor() {}

  public buildPath<T>(orig: Array<T>, rev: Array<T>): PathNode {
    if (!orig) {
      throw new Error("original sequence is null");
    }
    if (!rev) {
      throw new Error("revised sequence is null");
    }

    let N: number = orig.length;
    let M: number = rev.length;
    // 最大步数（先全减后全加）
    let MAX: number = N + M + 1;
    let size: number = 1 + 2 * MAX;
    let middle: number = Math.floor(size / 2);
    //构建纵坐标数组（用于存储每一步的最优路径位置）
    let diagonal: Array<PathNode> = Array(size);
    //用于获取初试位置的辅助节点
    diagonal[middle + 1] = new Snake(0, -1, null);
    //外层循环步数
    for (let d: number = 0; d < MAX; d++) {
      //内层循环所处偏移量，以2为步长，因为从所在位置走一步，偏移量只会相差2
      for (let k: number = -d; k <= d; k += 2) {
        //找出对应偏移量所在的位置，以及它上一步的位置（高位与低位）
        let kmiddle = middle + k;
        let kplus = kmiddle + 1;
        let kminus = kmiddle - 1;
        //若k为-d，则一定是从上往下走，即i相同
        //若diagonal[kminus].i < diagonal[kplus].i，则最优路径一定是从上往下走，即i相同
        let i: number;
        let prev: PathNode;

        if (k === -d || (k !== d && diagonal[kminus].i < diagonal[kplus].i)) {
          i = diagonal[kplus].i;
          prev = diagonal[kplus];
        } else {
          //若k为d，则一定是从左往右走，即i+1
          //若diagonal[kminus].i = diagonal[kplus].i，则最优路径一定是从左往右走，即i+1
          i = diagonal[kminus].i + 1;
          prev = diagonal[kminus];
        }
        //根据i与k，计算出j
        let j: number = i - k;
        //上一步的低位数据不再存储在数组中（每个k只清空低位即可全部清空）
        diagonal[kminus] = null;
        //当前是diff节点
        let node: PathNode = new DiffNode(i, j, prev);
        //判断被比较的两个数组中，当前位置的数据是否相同，相同，则去到对角线位置
        while (i < N && j < M && this.equals(orig[i], rev[j])) {
          i++;
          j++;
        }
        //判断是否去到对角线位置，若是，则生成snack节点，前节点为diff节点
        if (i > node.i) {
          node = new Snake(i, j, node);
        }
        //设置当前位置到数组中
        diagonal[kmiddle] = node;
        //达到目标位置，返回当前node
        if (i >= N && j >= M) {
          return diagonal[kmiddle];
        }
      }
    }
    throw new Error("could not find a diff path");
  }

  private equals<T>(orig: T, rev: T) {
    if (typeof orig === ("string" || "number")) {
      return orig === rev;
    } else if (typeof orig === "object") {
      let aProps = Object.getOwnPropertyNames(orig);
      let bProps = Object.getOwnPropertyNames(rev);

      if (aProps.length != bProps.length) {
        return false;
      }

      for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        var propA = orig[propName];
        var propB = rev[propName];
        if (propA !== propB) {
          return false;
        }
      }
      return true;
    }
  }

  public buildDiff<T>(path: PathNode, orig: Array<T>, rev: Array<T>): void {
    let result: Array<string> = [];
    if (!path) throw new Error("path is null");
    if (!orig) throw new Error("original sequence is null");
    if (!rev) throw new Error("revised sequence is null");

    while (path && path.prev && path.prev.j >= 0) {
      if (path.isSnake()) {
        let endi: number = path.i;
        let begini: number = path.prev.i;
        for (let i: number = endi - 1; i >= begini; i--) {
          result.push("  " + orig[i]);
        }
      } else {
        let i: number = path.i;
        let j: number = path.j;
        let prei: number = path.prev.i;
        if (prei < i) {
          result.push("- " + orig[i - 1]);
        } else {
          result.push("+ " + rev[j - 1]);
        }
      }
      path = path.prev;
    }
    result = result.reverse();
    for (let item of result) {
      console.log(item);
    }
  }
}
