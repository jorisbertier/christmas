// node roomMachine.test.mjs  (no dependencies)
import assert from "node:assert/strict";
import { initialRoomState, roomReducer as r } from "./roomMachine.js";

const run = (s, ...acts) => acts.reduce((st, a) => r(st, typeof a === "string" ? { type: a } : a), s);
let n = 0;
const test = (name, fn) => { fn(); n++; console.log("ok -", name); };

test("normal flow reaches the card", () => {
  let s = run(initialRoomState(), "READY", "INTRO_DONE", "TREE_CLICK", "GIFT_APPEAR", "GIFT_APPEAR", "GIFT_APPEAR", "GIFTS_READY");
  assert.equal(s.phase, "choosing");
  s = run(s, { type: "PICK", id: "green" });
  assert.equal(s.phase, "opening");
  assert.equal(s.choice, "green");
  s = run(s, "OPENED");
  assert.ok(s.cardOpen && s.phase === "revealed");
});

test("a second pick is impossible (fast clicks, other gift, same gift)", () => {
  let s = run(initialRoomState(), "READY", "INTRO_DONE", "TREE_CLICK", "GIFT_APPEAR", "GIFT_APPEAR", "GIFT_APPEAR", "GIFTS_READY", { type: "PICK", id: "red" });
  const after = run(s, { type: "PICK", id: "green" }, { type: "PICK", id: "champagne" }, { type: "PICK", id: "red" });
  assert.equal(after.choice, "red");
  assert.deepEqual(after, s);
  s = run(s, "OPENED", "CLOSE_CARD", { type: "PICK", id: "green" });
  assert.equal(s.choice, "red");
});

test("cannot pick before the gifts are ready or with a bad id", () => {
  let s = run(initialRoomState(), "READY", "INTRO_DONE", "TREE_CLICK", { type: "PICK", id: "red" });
  assert.equal(s.choice, null);
  s = run(s, "GIFT_APPEAR", "GIFTS_READY"); // only 1 gift visible: not ready
  assert.equal(s.phase, "focus");
  s = run(s, "GIFT_APPEAR", "GIFT_APPEAR", "GIFTS_READY", { type: "PICK", id: "blue" });
  assert.equal(s.choice, null);
});

test("the tree only reacts once, and never after a choice", () => {
  let s = run(initialRoomState(), "READY", "INTRO_DONE", "TREE_CLICK");
  const again = run(s, "TREE_CLICK", "TREE_CLICK");
  assert.deepEqual(again, s);
});

test("closing the card keeps the choice; it can be re-read but never restarted", () => {
  let s = run(initialRoomState(), "READY", "INTRO_DONE", "TREE_CLICK", "GIFT_APPEAR", "GIFT_APPEAR", "GIFT_APPEAR", "GIFTS_READY", { type: "PICK", id: "champagne" }, "OPENED", "CLOSE_CARD");
  assert.equal(s.phase, "done");
  assert.equal(s.choice, "champagne");
  s = run(s, "OPEN_CARD");
  assert.ok(s.cardOpen);
  s = run(s, "CLOSE_CARD", "TREE_CLICK", "INTRO_DONE", "GIFTS_READY");
  assert.equal(s.phase, "done");
  assert.equal(s.choice, "champagne");
});

test("a stored choice restores straight into the final state", () => {
  let s = initialRoomState("green");
  assert.equal(s.choice, "green");
  s = run(s, "READY");
  assert.equal(s.phase, "done");
  s = run(s, "TREE_CLICK", { type: "PICK", id: "red" }, { type: "ARM", id: "red" });
  assert.equal(s.choice, "green");
  assert.equal(s.armed, null);
});

test("touch arming only works while choosing", () => {
  let s = run(initialRoomState(), "READY", { type: "ARM", id: "red" });
  assert.equal(s.armed, null);
  s = run(s, "INTRO_DONE", "TREE_CLICK", "GIFT_APPEAR", "GIFT_APPEAR", "GIFT_APPEAR", "GIFTS_READY", { type: "ARM", id: "red" });
  assert.equal(s.armed, "red");
  s = run(s, "DISARM");
  assert.equal(s.armed, null);
});

console.log(`\n${n} tests passed`);
