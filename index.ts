import { MyersDiff } from "./core";
import { PathNode } from "./Node";

let oldText: string = "A\nB\nC\nA\nB\nB\nA";
let newText: string = "C\nB\nA\nB\nA\nC";
let oldList: Array<string> = oldText.split("\n");
let newList: Array<string> = newText.split("\n");

// MyersDiff<String>
let myersDiff: MyersDiff = new MyersDiff();
try {
  let pathNode: PathNode = myersDiff.buildPath(oldList, newList);
  console.log(pathNode.toString());
  myersDiff.buildDiff(pathNode, oldList, newList);
} catch (e) {
  console.log(e);
}
