import { CLOCK_CODE, SOLUTION, SABOTAGE_WINDOW } from "./clockMysterySolution.js";
import { ROUTES } from "./clockMysteryRoutes.js";
import { LOCATIONS, EVIDENCE, EVENTS, STATUS_RULES, DEDUCTIONS, PUZZLES } from "./clockMysteryStory.js";
import { DIALOGUES } from "./clockMysteryDialogues.js";

/* ------------------------------------------------------------------ */
/*  Time helpers                                                       */
/* ------------------------------------------------------------------ */

// "23:45" -> 1425 ; "00:10" -> 1450 (after midnight keeps counting)
export const toMin = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return (h < 12 ? h + 24 : h) * 60 + m;
};
export const fmt = (min) => {
  const t = ((min % 1440) + 1440) % 1440;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
};

/* ------------------------------------------------------------------ */
/*  Tokens: "ev:id", "flag:name", with "!" to negate                   */
/* ------------------------------------------------------------------ */

export const tokenOk = (has, tok) => (tok.startsWith("!") ? !has(tok.slice(1)) : has(tok));
export const tokensOk = (has, toks = []) => toks.every((t) => tokenOk(has, t));
// picks the LAST variant whose conditions are met
export const pickVariant = (has, variants = []) => {
  let found = null;
  for (const v of variants) if (tokensOk(has, v.when || [])) found = v;
  return found;
};

/* ------------------------------------------------------------------ */
/*  Shortest path (Dijkstra on the village graph)                      */
/* ------------------------------------------------------------------ */

export function buildGraph(routes, has = () => false) {
  const adj = {};
  routes.forEach((r) => {
    if (r.requires && !has(r.requires)) return;
    (adj[r.a] = adj[r.a] || []).push([r.b, r.min]);
    (adj[r.b] = adj[r.b] || []).push([r.a, r.min]);
  });
  return adj;
}

export function shortestPath(routes, from, to, has = () => false) {
  if (from === to) return { minutes: 0, path: [from] };
  const adj = buildGraph(routes, has);
  if (!adj[from] || !adj[to]) return { minutes: Infinity, path: [] };
  const dist = { [from]: 0 };
  const prev = {};
  const todo = new Set(Object.keys(adj));
  while (todo.size) {
    let u = null;
    for (const n of todo) if (dist[n] !== undefined && (u === null || dist[n] < dist[u])) u = n;
    if (u === null) break;
    todo.delete(u);
    if (u === to) break;
    for (const [v, w] of adj[u]) {
      if (dist[v] === undefined || dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        prev[v] = u;
      }
    }
  }
  if (dist[to] === undefined) return { minutes: Infinity, path: [] };
  const path = [to];
  while (path[0] !== from) path.unshift(prev[path[0]]);
  return { minutes: dist[to], path };
}

// from -> via -> ... -> to, adding the shortest segment of each leg
export function routeVia(routes, stops, has = () => false) {
  let minutes = 0;
  let path = [stops[0]];
  for (let i = 0; i < stops.length - 1; i++) {
    const leg = shortestPath(routes, stops[i], stops[i + 1], has);
    minutes += leg.minutes;
    path = path.concat(leg.path.slice(1));
  }
  return { minutes, path };
}

/* ------------------------------------------------------------------ */
/*  Could someone be inside the tower long enough to sabotage it?      */
/*  anchors: [[place, "HH:MM", "HH:MM"], ...] = verified presence      */
/* ------------------------------------------------------------------ */

export function canSabotage(anchors, routes, has = () => false, win = SABOTAGE_WINDOW) {
  const a = anchors.map(([place, from, to]) => ({ place, from: toMin(from), to: toMin(to) }));
  const start = toMin(win.from);
  const end = toMin(win.to);
  const options = [];
  for (let tIn = start; tIn + win.minStay <= end; tIn++) {
    const tOut = tIn + win.minStay;
    let ok = true;
    for (const x of a) {
      if (x.to <= tIn) {
        if (tIn - x.to < shortestPath(routes, x.place, "torre", has).minutes) ok = false;
      } else if (x.from >= tOut) {
        if (x.from - tOut < shortestPath(routes, "torre", x.place, has).minutes) ok = false;
      } else ok = false; // the anchor overlaps the time spent in the tower
      if (!ok) break;
    }
    if (ok) options.push([fmt(tIn), fmt(tOut)]);
  }
  return { feasible: options.length > 0, options };
}

/* ------------------------------------------------------------------ */
/*  Timeline board                                                     */
/*  offsets[clock] = how many minutes that clock is AHEAD of real time */
/* ------------------------------------------------------------------ */

export const realTime = (declared, clock, offsets) => toMin(declared) - (offsets[clock] || 0);

const POSITIONAL = ["seen", "departs", "span"];

export function validateTimeline(events, offsets, routes, has = () => false) {
  const rows = events
    .map((e) => ({
      ...e,
      tReal: realTime(e.t, e.clock, offsets),
      t2Real: e.t2 ? realTime(e.t2, e.clock, offsets) : null,
    }))
    .sort((x, y) => x.tReal - y.tReal);

  const checks = [];
  const people = [...new Set(rows.filter((r) => r.who).map((r) => r.who))];
  for (const who of people) {
    const list = rows.filter((r) => r.who === who && !r.claim && POSITIONAL.includes(r.kind));
    for (let i = 0; i < list.length - 1; i++) {
      const a = list[i];
      const b = list[i + 1];
      if (a.place === b.place) continue;
      const endA = a.kind === "span" ? a.t2Real : a.tReal;
      const need = shortestPath(routes, a.place, b.place, has).minutes;
      const gap = b.tReal - endA;
      checks.push({ type: "travel", who, a, b, need, gap, ok: gap >= need });
    }
  }

  const contradictions = [];
  for (const c of rows.filter((r) => r.claim)) {
    for (const o of rows.filter((r) => r.who === c.who && !r.claim && POSITIONAL.includes(r.kind))) {
      const oStart = o.tReal;
      const oEnd = o.kind === "span" ? o.t2Real : o.tReal;
      if (oEnd < c.tReal || oStart > c.t2Real) continue;
      if (o.place !== c.place) contradictions.push({ who: c.who, claim: c, other: o, why: "elsewhere" });
      else if (o.kind === "departs" && o.tReal < c.t2Real) contradictions.push({ who: c.who, claim: c, other: o, why: "left" });
    }
  }

  const groups = {};
  rows.filter((r) => r.group).forEach((r) => (groups[r.group] = groups[r.group] || []).push(r));
  const groupInfo = Object.entries(groups).map(([id, list]) => {
    const times = list.map((r) => r.tReal);
    const spread = Math.max(...times) - Math.min(...times);
    return { id, list, spread, agree: spread === 0, at: times[0] };
  });

  return { rows, checks, contradictions, groups: groupInfo };
}

// The clocks are right when every adjusted clock matches the truth and the
// three witnesses of the 23:45 chime are known.
export function clocksSolved(offsets, knownEventIds) {
  const need = ["e_bell_ref", "e_bell_posada", "e_bell_correos"];
  if (!need.every((id) => knownEventIds.includes(id))) return false;
  return Object.entries(SOLUTION.clockOffsets).every(([k, v]) => (offsets[k] || 0) === v);
}

/* ------------------------------------------------------------------ */
/*  Cipher (Caesar over the 27-letter Spanish alphabet)                */
/* ------------------------------------------------------------------ */

const ALPHA = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
export function shiftText(text, k) {
  return [...text]
    .map((ch) => {
      const i = ALPHA.indexOf(ch);
      return i < 0 ? ch : ALPHA[(((i + k) % ALPHA.length) + ALPHA.length) % ALPHA.length];
    })
    .join("");
}
export const encodeCipher = (plain, shift) => shiftText(plain, shift);
export const decodeCipher = (cipher, shift) => shiftText(cipher, -shift);
export const CIPHER_TEXT = encodeCipher(SOLUTION.puzzles.cipher.plain, SOLUTION.puzzles.cipher.shift);

/* ------------------------------------------------------------------ */
/*  Final accusation                                                   */
/* ------------------------------------------------------------------ */

export function evaluateAccusation(sel) {
  const S = SOLUTION;
  const picked = sel.evidence || [];
  const distinct = new Set(picked);
  const covers = (list) => picked.filter((e) => list.includes(e)).length === 1;
  const allValid = picked.every((e) => Object.values(S.evidence).some((l) => l.includes(e)));
  const parts = {
    culprit: sel.culprit === S.culprit,
    method: sel.method === S.method,
    interval: sel.interval === S.interval,
    evidence:
      picked.length === 3 && distinct.size === 3 && allValid &&
      Object.values(S.evidence).every(covers),
    explanation: sel.explanation === S.alibi,
  };
  const ok = Object.values(parts).every(Boolean);
  const nudges = {
    culprit: "Tu teoría explica una parte de los hechos, pero deja una contradicción sin resolver. Revisa quién pudo estar realmente en la torre y compáralo con los horarios corregidos.",
    method: "Tu teoría tiene un hueco: la puerta no estaba forzada y la leva guarda una pista. Revisa cómo se entró y qué se encontró en el mecanismo.",
    interval: "Los horarios no cuadran del todo. Revisa cuándo sonaron los cuartos y cuándo se vio luz en la sala de máquinas.",
    evidence: "Tus pruebas no bastan para sostener la acusación. Necesitas situar a esa persona en el lugar, explicar el medio y entender el porqué.",
    explanation: "La explicación de la coartada no encaja con los relojes corregidos. Relee los testimonios con las horas reales.",
  };
  const firstWrong = ["culprit", "method", "interval", "evidence", "explanation"].find((k) => !parts[k]);
  return { ok, parts, feedback: ok ? "" : nudges[firstWrong] };
}

/* ------------------------------------------------------------------ */
/*  Score                                                              */
/* ------------------------------------------------------------------ */

export const scoreFor = (hints, wrong) => Math.max(300, 1000 - 40 * hints - 25 * wrong);

/* ------------------------------------------------------------------ */
/*  localStorage (always guarded: it can be disabled or full)          */
/* ------------------------------------------------------------------ */

export const STORAGE = {
  progress: "christmasMysteryProgress",
  code: "christmasClockKeyCode",
  unlocked: "christmasClockUnlocked",
  completed: "christmasMysteryCompleted",
  hints: "christmasMysteryHintsUsed",
  score: "christmasMysteryScore",
};

export function safeGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}
export function safeSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch (e) {
    return false;
  }
}

export function saveVictory({ hints, score }) {
  safeSet(STORAGE.code, CLOCK_CODE);
  safeSet(STORAGE.unlocked, "true");
  safeSet(STORAGE.completed, "true");
  safeSet(STORAGE.hints, String(hints));
  safeSet(STORAGE.score, String(score));
}

// For the other section of the site (the clock door)
export function readClockKey() {
  return { unlocked: safeGet(STORAGE.unlocked) === "true", code: safeGet(STORAGE.code) };
}
export function verifyClockCode(input) {
  const k = readClockKey();
  return k.unlocked && typeof input === "string" && input === CLOCK_CODE && k.code === CLOCK_CODE;
}


/* ------------------------------------------------------------------ */
/*  GAME ENGINE (pure functions: the UI only calls these)              */
/* ------------------------------------------------------------------ */

export const initialState = () => ({
  v: 1,
  started: false,
  evidence: [],
  flags: {},
  events: [],
  visited: {},
  offsets: { posada: 0, correos: 0, ayuntamiento: 0, vigilante: 0 },
  deductions: [],
  hints: {},
  wrong: 0,
  completed: false,
  score: 0,
  lastProgress: Date.now(),
  asked: {},
});

export const makeHas = (state) => (tok) => {
  if (tok.startsWith("ev:")) return state.evidence.includes(tok.slice(3));
  if (tok.startsWith("flag:")) return !!state.flags[tok.slice(5)];
  return false;
};

export const hintsUsed = (state) => Object.values(state.hints).reduce((a, b) => a + b, 0);

// Adds flags / evidence / events and tells what is new
export function applyEffects(state, fx = {}) {
  const next = { ...state, flags: { ...state.flags }, evidence: [...state.evidence], events: [...state.events] };
  const added = { evidence: [], events: [], flags: [] };
  (fx.sets || []).forEach((f) => { if (!next.flags[f]) { next.flags[f] = true; added.flags.push(f); } });
  const addEvent = (id) => { if (!next.events.includes(id)) { next.events.push(id); added.events.push(id); } };
  (fx.events || []).forEach(addEvent);
  (fx.gives || []).forEach((id) => {
    if (next.evidence.includes(id)) return;
    next.evidence.push(id);
    added.evidence.push(id);
    const ev = EVIDENCE.find((e) => e.id === id);
    (ev?.events || []).forEach(addEvent);
  });
  if (added.evidence.length || added.events.length || added.flags.length) next.lastProgress = Date.now();
  return { state: next, added };
}

export function topicsFor(state, who) {
  const has = makeHas(state);
  return (DIALOGUES[who]?.topics || []).filter((t) => tokensOk(has, t.needs || []));
}

export function resolveTopic(state, who, topicId) {
  const has = makeHas(state);
  const topic = (DIALOGUES[who]?.topics || []).find((t) => t.id === topicId);
  if (!topic) return null;
  const v = pickVariant(has, topic.a);
  return v ? { text: v.t, fx: { sets: v.sets, gives: v.gives, events: v.events } } : null;
}

export function resolvePresent(state, who, evId) {
  const has = makeHas(state);
  const d = DIALOGUES[who];
  const v = pickVariant(has, d?.present?.[evId] || []);
  if (v) return { text: v.t, fx: { sets: v.sets, gives: v.gives, events: v.events }, reacted: true };
  return { text: d?.fallback || "«...»", fx: {}, reacted: false };
}

export const locationUnlocked = (state, loc) => tokensOk(makeHas(state), loc.unlock || []);

export function examineObject(state, locId, objId) {
  const loc = LOCATIONS.find((l) => l.id === locId);
  const obj = loc?.objects.find((o) => o.id === objId);
  if (!obj) return null;
  const has = makeHas(state);
  if (!tokensOk(has, obj.needs || [])) return { text: obj.locked || "No encuentras nada nuevo.", fx: {}, found: false };
  const already = obj.gives && state.evidence.includes(obj.gives);
  return { text: obj.text, fx: { gives: obj.gives && !already ? [obj.gives] : [] }, found: !!obj.gives, already };
}

export function evidenceDesc(state, ev) {
  const v = pickVariant(makeHas(state), (ev.after || []).map((a) => ({ when: a.when, t: a.desc })));
  return v ? v.t : ev.desc;
}

export function statusOf(state, id) {
  const has = makeHas(state);
  for (const [status, toks] of STATUS_RULES[id] || []) if (tokensOk(has, toks)) return status;
  return has(`flag:met:${id}`) ? "suspect" : "untouched";
}

export function phaseOf(state) {
  const f = state.flags;
  if (state.completed || state.wrong > 0 || f.sequence_solved) return 5;
  if (f.santa_secret || f.cipher_solved) return 4;
  if (f.clock_posada || f.clock_correos || state.evidence.length >= 8) return 3;
  if (state.evidence.length >= 3) return 2;
  return 1;
}

export const puzzleAvailable = (state, puzzle) => tokensOk(makeHas(state), puzzle.needs || []);

export function tryDeduction(state, evidenceIds, conclusion) {
  const has = makeHas(state);
  const ids = [...new Set(evidenceIds)].sort();
  const d = DEDUCTIONS.find((x) => x.conclusion === conclusion);
  if (!d) return { ok: false, reason: "wrong" };
  const need = [...d.requires].sort();
  if (ids.length !== need.length || ids.some((x, i) => x !== need[i])) return { ok: false, reason: "evidence" };
  if (!tokensOk(has, (d.needsFlags || []).map((x) => `flag:${x}`))) return { ok: false, reason: "early" };
  return { ok: true, deduction: d };
}

export function nextSuggestion(state) {
  const has = makeHas(state);
  const list = [
    [() => state.evidence.length < 3, "Empieza por la torre: examina la sala de máquinas, la sonería y el escalón de la puerta."],
    [() => !has("flag:met:clara"), "Habla con Clara, en la plaza: el coro oyó cosas."],
    [() => !has("flag:light_rumor"), "Pregunta a Berta qué vio desde la ventana de la posada."],
    [() => has("ev:ev_libro_posada") && !has("flag:clock_posada"), "Pregunta a Berta si su reloj va en hora."],
    [() => has("flag:light_rumor") && !has("flag:clock_correos"), "Visita Correos y pregunta a Nora por su reloj."],
    [() => has("ev:ev_diario") && !has("flag:travel_solved"), "El diario del vigilante no cuadra con la posada: usa el planificador de rutas."],
    [() => has("flag:clock_posada") && has("flag:clock_correos") && !has("flag:timeline_solved"), "Abre la cronología y ajusta los relojes con los testigos de los cuartos de las 23:45."],
    [() => has("ev:ev_engranaje") && !has("flag:santa_secret"), "Enseña el engranaje a Papá Noel: tiene una historia que contarte."],
    [() => has("ev:ev_carta_cifrada") && !has("flag:cipher_solved"), "La carta cifrada necesita una clave que está en el registro de mantenimiento."],
    [() => !has("flag:timeline_solved"), "Revisa los testimonios con la cronología: una hora no es siempre la misma en todos los relojes."],
    [() => true, "Cuando tengas una teoría completa, formula la acusación final."],
  ];
  return (list.find(([c]) => c())||[])[1];
}

export const clocksList = (state) => EVENTS.filter((e) => state.events.includes(e.id));

export function finishVictory(state) {
  const hints = hintsUsed(state);
  const score = scoreFor(hints, state.wrong);
  saveVictory({ hints, score });
  return { ...state, completed: true, score };
}

export const knownRoutes = ROUTES;
export { PUZZLES };
