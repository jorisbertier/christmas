// Bot playthrough: proves the whole game can be finished by following the clues.
import assert from "node:assert/strict";
import * as L from "./clockMysteryLogic.js";
import { LOCATIONS, EVIDENCE, DEDUCTIONS, PUZZLES, SUSPECTS } from "./clockMysteryStory.js";
import { SOLUTION } from "./clockMysterySolution.js";

let s = L.initialState();
const fx = (f) => { const r = L.applyEffects(s, f); s = r.state; return r; };
const ask = (who, topic) => { fx({ sets: [`met:${who}`] }); const r = L.resolveTopic(s, who, topic); assert.ok(r, `${who}:${topic} unavailable`); fx(r.fx); return r; };
const present = (who, ev) => { assert.ok(s.evidence.includes(ev), `no tienes ${ev}`); fx({ sets: [`met:${who}`] }); const r = L.resolvePresent(s, who, ev); assert.ok(r.reacted, `${who} no reacciona a ${ev}`); fx(r.fx); };
const take = (loc, obj) => { const l = LOCATIONS.find((x) => x.id === loc); assert.ok(L.locationUnlocked(s, l), `${loc} bloqueado`); const r = L.examineObject(s, loc, obj); assert.ok(r.found, `${loc}/${obj} sin acceso`); fx(r.fx); };
const deduce = (id) => { const d = DEDUCTIONS.find((x) => x.id === id); const r = L.tryDeduction(s, d.requires, d.conclusion); assert.ok(r.ok, `${id}: ${r.reason}`); fx({ sets: d.sets }); s.deductions.push(id); };

console.log("— Fase 1: la torre y el pueblo");
take("torre", "sala"); take("torre", "sonería"); take("torre", "escalon");
ask("clara", "heard"); ask("clara", "saw"); ask("clara", "bell"); ask("clara", "before");
ask("casimiro", "where"); ask("casimiro", "key");
take("relojeria", "mostrador"); take("relojeria", "botas");
ask("lucien", "where"); ask("lucien", "tower");

console.log("— Fase 2: la posada y Correos");
ask("berta", "who"); ask("berta", "saw"); ask("berta", "clock");
take("posada", "libro"); take("posada", "facturas");
present("lucien", "ev_libro_posada");
ask("nora", "saw"); ask("nora", "clock"); ask("nora", "others");
take("correos", "registro"); take("correos", "estante"); take("correos", "cesto");
present("nora", "ev_sobre");
take("relojeria", "cajon");
ask("berta", "guest");
assert.ok(s.flags.grinch_room, "Berta debe admitir la habitación 3");

console.log("— Fase 3: Grinch, relojes y viaje");
ask("grinch", "rust");
assert.ok(s.evidence.includes("ev_foto"), "el Grinch debe dar la foto");
deduce("d_grinch");
take("ayuntamiento", "llaves"); take("ayuntamiento", "citas");
present("madeleine", "ev_chocolates"); ask("madeleine", "bell");
take("taller", "banco");
ask("anselmo", "where"); ask("pip", "brandt"); ask("anselmo", "where");
present("anselmo", "ev_chocolates"); present("grinch", "ev_carta_anonima");
take("invernadero", "botas"); take("invernadero", "planos"); ask("eloy", "bell"); ask("eloy", "where");
ask("pip", "santa");
take("almacen", "estanteria");
present("santa", "ev_engranaje");
take("almacen", "cuaderno");
ask("santa", "key"); ask("santa", "pip");
ask("berta", "vigilante");
take("casa_vigilante", "escritorio");
present("casimiro", "ev_diario");
present("pip", "ev_huellas");

// Puzzles
const puzzleOk = (id) => { const p = PUZZLES.find((x) => x.id === id); assert.ok(L.puzzleAvailable(s, p), `${id} no disponible`); };
puzzleOk("travel");
assert.equal(L.shortestPath(L.knownRoutes, "torre", "posada").minutes, SOLUTION.puzzles.travel.minutes);
fx({ sets: ["travel_solved"] });
puzzleOk("clocks");
assert.ok(L.clocksSolved(SOLUTION.clockOffsets, s.events), "faltan testigos de los cuartos");
fx({ sets: ["timeline_solved"] });
puzzleOk("cipher");
fx({ sets: ["cipher_solved"] });
puzzleOk("traces"); fx({ sets: ["traces_solved"] });
puzzleOk("cross"); fx({ sets: ["cross_solved"] });
puzzleOk("sequence"); fx({ sets: ["sequence_solved"] });

console.log("— Fase 4: deducciones");
["d_keys", "d_meeting", "d_pin", "d_time", "d_copy", "d_diary", "d_pip", "d_eloy"].forEach(deduce);
assert.equal(s.deductions.length, 9);

// every piece of evidence found?
const missing = EVIDENCE.filter((e) => !s.evidence.includes(e.id)).map((e) => e.id);
assert.deepEqual(missing, [], "pruebas inalcanzables: " + missing);

// statuses: Lucien never gets cleared, nobody else is untouched/unfairly guilty
const st = Object.fromEntries(SUSPECTS.map((x) => [x.id, L.statusOf(s, x.id)]));
console.log(st);
assert.notEqual(st.lucien, "cleared");
assert.ok(st.grinch === "cleared" && st.madeleine === "cleared" && st.anselmo === "cleared");

// the accusation
const acc = { culprit: "lucien", method: "llave_pasador", interval: "23:45-23:57", evidence: ["ev_registro_entregas", "ev_paquete", "ev_carta_cifrada"], explanation: "salida_relojeria" };
assert.ok(L.evaluateAccusation(acc).ok);
for (const id of ["ev_registro_entregas", "ev_paquete", "ev_carta_cifrada"]) assert.ok(s.evidence.includes(id));
console.log("Phase:", L.phaseOf(s), "· evidence:", s.evidence.length, "· events:", s.events.length);
console.log("\nplaythrough ok");
