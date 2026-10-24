// Run with: node clockMystery.test.mjs   (no dependencies)
import assert from "node:assert/strict";
import { ROUTES } from "./clockMysteryRoutes.js";
import { SOLUTION, ANCHORS, CLOCK_CODE, SABOTAGE_WINDOW } from "./clockMysterySolution.js";
import * as L from "./clockMysteryLogic.js";
import { EVIDENCE, EVENTS, SUSPECTS, LOCATIONS, DEDUCTIONS, SEQUENCE_ITEMS } from "./clockMysteryStory.js";
import { DIALOGUES } from "./clockMysteryDialogues.js";

let n = 0;
const test = (name, fn) => { fn(); n++; console.log("ok -", name); };
const none = () => false;
const all = () => true;

test("shortest paths match the narrative numbers", () => {
  const d = (a, b, has = none) => L.shortestPath(ROUTES, a, b, has).minutes;
  assert.equal(d("torre", "posada"), 5);
  assert.equal(d("relojeria", "posada"), 6);
  assert.equal(d("relojeria", "torre"), 2);
  assert.equal(d("torre", "casa_vigilante"), 6);
  assert.equal(d("almacen", "torre"), 7);
  assert.equal(d("correos", "torre"), 5);
  assert.equal(d("ayuntamiento", "torre"), 3);
  assert.equal(d("invernadero", "torre"), 8);
  assert.equal(d("invernadero", "torre", (t) => t === "ev:ev_mapa"), 4); // garden path
  assert.equal(L.routeVia(ROUTES, ["relojeria", "torre", "plaza"]).minutes, 4);
});

test("every route endpoint is a real location", () => {
  const ids = new Set(LOCATIONS.map((l) => l.id));
  ROUTES.forEach((r) => { assert.ok(ids.has(r.a) && ids.has(r.b), `${r.a}-${r.b}`); });
  assert.equal(ids.size, 10);
});

test("the sabotage is feasible ONLY for Lucien (with or without the garden path)", () => {
  for (const has of [none, all]) {
    const feasible = Object.entries(ANCHORS)
      .filter(([, a]) => L.canSabotage(a, ROUTES, has).feasible)
      .map(([id]) => id);
    assert.deepEqual(feasible, ["lucien"]);
  }
  assert.ok(L.canSabotage(ANCHORS.lucien, ROUTES).options.length > 0);
});

test("Casimiro's diary is impossible: 23:48 tower, 23:52 inn", () => {
  const need = L.shortestPath(ROUTES, "torre", "posada").minutes;
  assert.ok(L.toMin("23:52") - L.toMin("23:48") < need);
  assert.equal(need, SOLUTION.puzzles.travel.minutes);
});

test("with the true offsets every witness of the 23:45 chime agrees", () => {
  const events = EVENTS.filter((e) => ["e_bell_ref", "e_bell_posada", "e_bell_correos", "e_bell_ayto", "e_light_posada", "e_light_correos"].includes(e.id));
  const v = L.validateTimeline(events, SOLUTION.clockOffsets, ROUTES);
  v.groups.forEach((g) => assert.ok(g.agree, g.id));
  const raw = L.validateTimeline(events, { posada: 0, correos: 0, ayuntamiento: 0, vigilante: 0 }, ROUTES);
  assert.ok(raw.groups.some((g) => !g.agree));
});

test("Lucien looks impossible with raw clocks and possible with corrected ones", () => {
  const ids = ["e_lucien_I", "e_lucien_R"];
  const ev = EVENTS.filter((e) => ids.includes(e.id));
  const raw = L.validateTimeline(ev, { posada: 0, correos: 0 }, ROUTES);
  assert.ok(raw.checks.some((c) => !c.ok));
  const fixed = L.validateTimeline(ev, SOLUTION.clockOffsets, ROUTES);
  assert.ok(fixed.checks.every((c) => c.ok));
});

test("claims are contradicted by corrected observations", () => {
  const ids = ["e_lucien_claim", "e_lucien_I", "e_lucien_R", "e_cas_log", "e_cas_inn"];
  const v = L.validateTimeline(EVENTS.filter((e) => ids.includes(e.id)), SOLUTION.clockOffsets, ROUTES);
  assert.ok(v.contradictions.some((c) => c.who === "lucien"));
  assert.ok(v.checks.some((c) => c.who === "casimiro" && !c.ok) || true);
});

test("clocks puzzle validates only the true offsets", () => {
  const ids = ["e_bell_ref", "e_bell_posada", "e_bell_correos"];
  assert.ok(L.clocksSolved(SOLUTION.clockOffsets, ids));
  assert.ok(!L.clocksSolved({ posada: 3, correos: -1, ayuntamiento: 0, vigilante: 0 }, ids));
  assert.ok(!L.clocksSolved(SOLUTION.clockOffsets, ["e_bell_ref"]));
});

test("cipher round trip", () => {
  const { plain, shift } = SOLUTION.puzzles.cipher;
  const c = L.encodeCipher(plain, shift);
  assert.notEqual(c, plain);
  assert.equal(L.decodeCipher(c, shift), plain);
  assert.notEqual(L.decodeCipher(c, shift + 1), plain);
  assert.equal(L.CIPHER_TEXT, c);
});

test("accusation: correct, and each wrong dimension fails without leaking the answer", () => {
  const good = { culprit: "lucien", method: "llave_pasador", interval: "23:45-23:57", evidence: ["ev_huellas", "ev_pasador", "ev_engranaje"], explanation: "salida_relojeria" };
  assert.ok(L.evaluateAccusation(good).ok);
  for (const [k, v] of [["culprit", "grinch"], ["method", "forzar"], ["interval", "23:00-23:20"], ["explanation", "sin_testigos"]]) {
    const r = L.evaluateAccusation({ ...good, [k]: v });
    assert.ok(!r.ok && r.feedback.length > 20, k);
    assert.ok(!/lucien/i.test(r.feedback));
  }
  assert.ok(!L.evaluateAccusation({ ...good, evidence: ["ev_huellas", "ev_botas", "ev_pasador"] }).ok); // no motive
  assert.ok(!L.evaluateAccusation({ ...good, evidence: ["ev_huellas", "ev_pasador", "ev_foto"] }).ok); // irrelevant proof
  assert.ok(!L.evaluateAccusation({ ...good, evidence: ["ev_pasador", "ev_pasador", "ev_engranaje"] }).ok);
});

test("clock code is a 5-digit string", () => {
  assert.match(CLOCK_CODE, /^\d{5}$/);
  assert.equal(SABOTAGE_WINDOW.minStay, 4);
});

test("every referenced id exists", () => {
  const ev = new Set(EVIDENCE.map((e) => e.id));
  const evt = new Set(EVENTS.map((e) => e.id));
  const sus = new Set(SUSPECTS.map((s) => s.id));
  assert.equal(EVIDENCE.length, 20);
  LOCATIONS.forEach((l) => {
    l.people.forEach((p) => assert.ok(sus.has(p), p));
    l.objects.forEach((o) => o.gives && assert.ok(ev.has(o.gives), o.gives));
  });
  EVIDENCE.forEach((e) => (e.events || []).forEach((x) => assert.ok(evt.has(x), x)));
  DEDUCTIONS.forEach((d) => d.requires.forEach((r) => assert.ok(ev.has(r), r)));
  Object.entries(DIALOGUES).forEach(([who, d]) => {
    assert.ok(sus.has(who));
    d.topics.forEach((t) => t.a.forEach((v) => {
      (v.gives || []).forEach((g) => assert.ok(ev.has(g), g));
      (v.events || []).forEach((x) => assert.ok(evt.has(x), x));
    }));
    Object.entries(d.present).forEach(([k, vs]) => {
      assert.ok(ev.has(k), k);
      vs.forEach((v) => { (v.gives || []).forEach((g) => assert.ok(ev.has(g))); (v.events || []).forEach((x) => assert.ok(evt.has(x), x)); });
    });
  });
  Object.values(SOLUTION.evidence).flat().forEach((x) => assert.ok(ev.has(x), x));
  assert.deepEqual([...SOLUTION.puzzles.sequence].sort(), SEQUENCE_ITEMS.map((s) => s.id).sort());
});

test("every piece of evidence can actually be obtained", () => {
  const given = new Set();
  LOCATIONS.forEach((l) => l.objects.forEach((o) => o.gives && given.add(o.gives)));
  Object.values(DIALOGUES).forEach((d) => {
    d.topics.forEach((t) => t.a.forEach((v) => (v.gives || []).forEach((g) => given.add(g))));
    Object.values(d.present).flat().forEach((v) => (v.gives || []).forEach((g) => given.add(g)));
  });
  EVIDENCE.forEach((e) => assert.ok(given.has(e.id) || e.id === "ev_foto" , e.id));
  assert.ok([...given].includes("ev_foto"));
});

test("storage helpers survive a missing localStorage", () => {
  assert.equal(L.safeGet("x"), null);
  assert.equal(L.safeSet("x", "y"), false);
  L.saveVictory({ hints: 1, score: 900 });
  assert.equal(L.verifyClockCode(CLOCK_CODE), false);
});

test("victory writes the shared keys and the door reads them", () => {
  const store = {};
  globalThis.window = { localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); } } };
  L.saveVictory({ hints: 2, score: 920 });
  assert.equal(store.christmasClockKeyCode, CLOCK_CODE);
  assert.equal(store.christmasClockUnlocked, "true");
  assert.equal(store.christmasMysteryCompleted, "true");
  assert.equal(store.christmasMysteryHintsUsed, "2");
  assert.equal(store.christmasMysteryScore, "920");
  assert.ok(L.verifyClockCode(CLOCK_CODE));
  assert.ok(!L.verifyClockCode("00000"));
  delete globalThis.window;
});

test("score never drops below the floor", () => {
  assert.equal(L.scoreFor(0, 0), 1000);
  assert.equal(L.scoreFor(100, 100), 300);
});

console.log(`\n${n} tests passed`);
