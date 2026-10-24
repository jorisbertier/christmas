/* ------------------------------------------------------------------ */
/*  Narrative data (visible to the player). Spanish texts.             */
/* ------------------------------------------------------------------ */

export const TITLE = "El último campanazo de medianoche";

export const INTRO = [
  "Es la noche del 24 de diciembre. El pueblo, cubierto de nieve, espera la campanada que da comienzo oficial a la Navidad e ilumina todas las casas.",
  "A medianoche, las campanas no suenan. El gran reloj se ha detenido exactamente a las 00:00. Las agujas están inmóviles y alguien ha manipulado el mecanismo.",
  "La puerta de mantenimiento no está forzada. Una llave ha desaparecido. La alcaldesa te ha convocado discretamente: descubre quién lo hizo, cómo y por qué antes de que termine la celebración.",
];

export const PHASES = [
  "El reloj se detiene",
  "Los secretos del pueblo",
  "La cronología imposible",
  "La verdad oculta",
  "El último campanazo",
];

export const CLOCKS = [
  { id: "posada", name: "Reloj de la posada" },
  { id: "correos", name: "Reloj de Correos" },
  { id: "ayuntamiento", name: "Reloj del ayuntamiento" },
  { id: "vigilante", name: "Reloj de bolsillo del vigilante" },
];

/* ---------------- locations ---------------- */

export const LOCATIONS = [
  {
    id: "torre", name: "La torre del reloj", x: 600, y: 335, people: ["casimiro"], unlock: [],
    blurb: "La torre se alza sobre la plaza con la esfera iluminada y las agujas clavadas en las doce. Una cinta de precinto cruza la puerta de mantenimiento.",
    objects: [
      { id: "sala", name: "Sala de máquinas", gives: "ev_pasador", text: "Entre los dientes de la leva de la sonería hay algo que no debería estar." },
      { id: "sonería", name: "Tren de sonería", gives: "ev_engranaje", text: "Un engranaje dorado con un diente fisurado preside la sonería." },
      { id: "escalon", name: "Escalón de la puerta", gives: "ev_huellas", text: "La nieve del umbral guarda más de una historia." },
    ],
  },
  {
    id: "plaza", name: "La plaza central", x: 600, y: 490, people: ["clara", "grinch"], unlock: [],
    blurb: "El coro sigue en la plaza, desconcertado, bajo el gran árbol de Navidad. Los vecinos murmuran. Nadie se atreve a irse.",
    objects: [
      { id: "arbol", name: "El gran árbol", text: "Luces doradas, bolas rojas y una estrella en la copa. Eloy la colocó antes de medianoche." },
      { id: "faroles", name: "Los faroles", text: "Los faroles parpadean con calma. Desde aquí se ve la ventana alta de la torre, ahora a oscuras." },
    ],
  },
  {
    id: "relojeria", name: "La relojería de Lucien", x: 405, y: 335, people: ["lucien"], unlock: [],
    blurb: "Estantes llenos de relojes que laten a destiempo. Huele a aceite fino y a madera vieja. Es el taller del hombre que mejor conoce el gran reloj.",
    objects: [
      { id: "mostrador", name: "Mostrador y registro", gives: "ev_registro_mant", text: "El libro oficial de mantenimiento del mecanismo." },
      { id: "botas", name: "Botas junto a la puerta", gives: "ev_botas", needs: ["ev:ev_huellas"], locked: "Un par de botas de cuero junto a la puerta. Nada te llama la atención... todavía.", text: "Un par de botas con el talón remendado." },
      { id: "cajon", name: "Cajón con doble fondo", gives: "ev_carta_cifrada", needs: ["ev:ev_sobre"], locked: "Un cajón cerrado con llave. No tienes motivo para forzarlo.", text: "Una hoja escondida en un doble fondo." },
    ],
  },
  {
    id: "correos", name: "La oficina de correos", x: 815, y: 500, people: ["nora"], unlock: ["flag:light_rumor"],
    unlockText: "Alguien ha visto algo desde Correos... pregunta por una luz en la torre.",
    blurb: "Sacos, sellos y una estufa que huele a canela. Desde la puerta se ve la relojería.",
    objects: [
      { id: "registro", name: "Registro de entregas", gives: "ev_registro_entregas", text: "Nora apunta cada movimiento con precisión de notaria." },
      { id: "cesto", name: "Papelera junto a la estufa", gives: "ev_sobre", needs: ["flag:nora_hint"], locked: "Una papelera llena de papeles. No sabes qué buscar.", text: "Un sobre arrugado." },
      { id: "estante", name: "Paquetes del estante", gives: "ev_paquete", text: "Paquetes pendientes de entrega, uno con una etiqueta llamativa." },
    ],
  },
  {
    id: "posada", name: "La posada", x: 320, y: 525, people: ["berta"], unlock: [],
    blurb: "Cálida, ruidosa y llena de gente que no consigue dormir. Berta lo ve todo desde la barra.",
    objects: [
      { id: "libro", name: "Libro de la posada", gives: "ev_libro_posada", text: "Cada entrada y salida de la noche, con la hora de la sala." },
      { id: "facturas", name: "Bandeja de facturas", gives: "ev_chocolates", text: "Facturas y notas de la cocina de la noche." },
    ],
  },
  {
    id: "ayuntamiento", name: "El ayuntamiento", x: 815, y: 350, people: ["madeleine"], unlock: [],
    blurb: "Un edificio solemne con la bandera a media asta por el nerviosismo. Madeleine ha dejado el discurso a medias sobre la mesa.",
    objects: [
      { id: "citas", name: "Libro de citas", gives: "ev_acta", needs: ["ev:ev_chocolates"], locked: "La agenda oficial está en blanco entre las diez y la medianoche. Llama la atención, pero nada más.", text: "La agenda de la alcaldesa." },
      { id: "llaves", name: "Armario de llaves", gives: "ev_llaves", text: "Un armario con ganchos numerados." },
    ],
  },
  {
    id: "taller", name: "El taller de juguetes", x: 125, y: 610, people: ["anselmo", "pip"], unlock: ["ev:ev_pasador"],
    unlockText: "Ese pasador está torneado con precisión. ¿Quién tornea piezas en el pueblo?",
    blurb: "Soldaditos, trenes y muñecas a medio pintar. Huele a barniz y a serrín. Todo el mundo habla bajito.",
    objects: [{ id: "banco", name: "Banco de trabajo", gives: "ev_carta_anonima", text: "Entre pinceles y botes de pintura hay un papel doblado." }],
  },
  {
    id: "almacen", name: "El almacén de Papá Noel", x: 500, y: 675, people: ["santa"], unlock: ["flag:pip_left"],
    unlockText: "Alguien vio a Pip correr hacia un edificio del extremo del pueblo...",
    blurb: "Un granero rojo con una estrella en el hastial. Dentro, trineos, sacos y una calma que no es de este mundo.",
    objects: [
      { id: "estanteria", name: "Estantería", gives: "ev_prototipo", needs: ["flag:pip_santa"], locked: "Estantes de cajas y paquetes. Nada que te llame la atención.", text: "Una caja de música con una nota." },
      { id: "cuaderno", name: "Cuaderno de Papá Noel", gives: "ev_cuaderno", needs: ["flag:santa_secret"], locked: "Un cuaderno de cuero cerrado con una cinta. No es tuyo para abrirlo.", text: "Notas de hace cien años." },
    ],
  },
  {
    id: "casa_vigilante", name: "La casa del vigilante", x: 740, y: 665, people: [], unlock: ["flag:diary_mentioned"],
    unlockText: "Casimiro dice que su diario de rondas está en su casa.",
    blurb: "Una casita pegada al camino con una linterna en la puerta. Todo está ordenado con una precisión casi militar.",
    objects: [
      { id: "escritorio", name: "Escritorio", gives: "ev_diario", text: "El diario de rondas del vigilante." },
      { id: "termo", name: "Termo y manta", text: "Un termo vacío y una manta doblada. Alguien tomó un descanso... pero no esta noche: el termo está frío." },
    ],
  },
  {
    id: "invernadero", name: "El invernadero", x: 1060, y: 610, people: ["eloy"], unlock: ["ev:ev_huellas"],
    unlockText: "Esas huellas con clavos hablan de alguien que trabaja la tierra y la nieve.",
    blurb: "Cristal empañado, tierra caliente y orquídeas en plena noche de invierno. Un mundo verde dentro del frío.",
    objects: [
      { id: "botas", name: "Botas de trabajo", gives: "ev_botas_clavos", text: "Botas claveteadas junto a la puerta." },
      { id: "planos", name: "Mesa de planos", gives: "ev_mapa", text: "Planos de caminos dibujados a mano." },
    ],
  },
];

/* ---------------- suspects ---------------- */

export const SUSPECTS = [
  { id: "anselmo", name: "Anselmo Brandt", role: "El fabricante de juguetes", personality: "Orgulloso, trabajador, tradicional y muy protector con su reputación.", bio: "Tercera generación de fabricantes de juguetes. Su taller mantiene abierto un contrato con el ayuntamiento desde hace décadas.", alibi: "Dice haber estado en su taller toda la noche con Pip." },
  { id: "lucien", name: "Lucien Moreau", role: "El relojero", personality: "Inteligente, meticuloso, reservado y algo arrogante.", bio: "Mantiene el gran reloj desde hace veinte años. Nadie conoce mejor sus puntos débiles.", alibi: "Dice que no salió de su relojería hasta las 23:57." },
  { id: "madeleine", name: "Madeleine Fontaine", role: "La alcaldesa", personality: "Elegante, autoritaria, diplomática y obsesionada con la reputación del pueblo.", bio: "Organiza la ceremonia de Navidad. Te convocó discretamente para evitar un escándalo.", alibi: "Dice haber estado sola en su despacho preparando el discurso." },
  { id: "nora", name: "Nora Quill", role: "La cartera", personality: "Observadora, curiosa, rápida y aparentemente inocente.", bio: "Reparte cartas y paquetes por todo el pueblo. Sabe más de la vida de los vecinos que ellos mismos.", alibi: "Dice haber estado en Correos hasta poco antes de la campanada." },
  { id: "pip", name: "Pip", role: "El elfo fabricante de juguetes", personality: "Ingenioso, nervioso, creativo y algo torpe.", bio: "Trabaja en el taller de Anselmo. Cree que su jefe se ha apropiado de una de sus invenciones.", alibi: "Dice que no se movió del taller." },
  { id: "berta", name: "Berta", role: "La posadera", personality: "Amable, perspicaz, discreta y gran observadora.", bio: "Dirige la posada, donde se reúne medio pueblo. Lo ve y lo oye todo.", alibi: "Dice haber estado tras la barra toda la noche." },
  { id: "eloy", name: "Eloy", role: "El jardinero", personality: "Tranquilo, paciente, solitario y atento a los detalles.", bio: "Cuida los jardines, el invernadero y los caminos. Mantiene una vieja disputa con la alcaldía.", alibi: "Dice que barrió la torre y luego ayudó con el árbol." },
  { id: "casimiro", name: "Casimiro Vega", role: "El vigilante nocturno", personality: "Disciplinado, desconfiado y obsesionado con los horarios.", bio: "Hace las rondas del pueblo cada noche desde hace treinta años. Teme perder su puesto.", alibi: "Dice que hizo sus rondas con puntualidad. Todo está en su diario." },
  { id: "santa", name: "Papá Noel", role: "El respetado", personality: "Generoso, sereno, sabio y aparentemente incapaz de hacer daño.", bio: "Venerado por todos. Guarda una historia sobre el origen del reloj que nunca ha contado.", alibi: "Dice haber estado en su almacén preparando el trineo." },
  { id: "grinch", name: "El Grinch", role: "El gruñón del pueblo", personality: "Sarcástico, inteligente, provocador y contrario a la Navidad.", bio: "Vive aparte y desprecia las celebraciones. Todo el pueblo lo señala con el dedo.", alibi: "Dice haber paseado lejos de la gente." },
  { id: "clara", name: "Clara", role: "Cantante del coro", personality: "Cálida, atenta y de oído finísimo.", bio: "Lleva toda la noche cantando en la plaza. Su oído le permite oír lo que otros ignoran.", alibi: "Ha estado en la plaza con el coro toda la noche." },
];

// Status rules: the first matching rule (best first) wins.
export const STATUS_RULES = {
  anselmo: [["cleared", ["flag:meeting_deduced"]], ["partial", ["flag:anselmo_met"]], ["questioned", ["flag:pip_says"]]],
  lucien: [["questioned", ["flag:lucien_inn"]]],
  madeleine: [["cleared", ["flag:meeting_deduced"]], ["partial", ["flag:anselmo_met"]], ["questioned", ["ev:ev_chocolates"]]],
  nora: [["cleared", ["flag:timeline_solved", "flag:clara_saw"]], ["partial", ["flag:nora_read_letter"]]],
  pip: [["cleared", ["flag:pip_cleared"]], ["partial", ["flag:pip_santa"]], ["questioned", ["flag:pip_left"]]],
  berta: [["cleared", ["flag:timeline_solved", "flag:met:berta"]], ["partial", ["flag:grinch_room"]]],
  eloy: [["cleared", ["flag:eloy_cleared"]], ["partial", ["flag:eloy_prints"]], ["questioned", ["ev:ev_huellas"]]],
  casimiro: [["cleared", ["flag:casimiro_cleared"]], ["partial", ["flag:casimiro_ate"]], ["questioned", ["ev:ev_diario"]]],
  santa: [["cleared", ["flag:pip_cleared", "flag:key_santa"]], ["partial", ["flag:santa_secret"]], ["questioned", ["ev:ev_llaves"]]],
  grinch: [["cleared", ["flag:grinch_cleared"]], ["partial", ["flag:grinch_room"]], ["questioned", ["flag:grinch_seen"]]],
  clara: [["cleared", ["flag:met:clara"]]],
};

/* ---------------- evidence ---------------- */

export const EVIDENCE = [
  { id: "ev_pasador", name: "Pasador de latón en la leva", place: "torre", category: "mecanismo", time: "00:00", relevance: "alta", related: ["lucien"],
    desc: "Un pasador de latón de tres milímetros, torneado con precisión, encajado entre los dientes de la leva que gobierna la sonería. Sin él, las campanas habrían sonado a medianoche. No hay golpes ni marcas de palanca: alguien lo colocó con cuidado.",
    misreading: "Cualquiera con un torno podría haberlo fabricado. Su precisión sugiere un oficio, no un nombre.",
    after: [{ when: ["flag:cipher_solved"], desc: "El pasador no destruye nada: detiene la sonería de forma limpia, justo antes de que un engranaje defectuoso soporte el golpe de medianoche. Alguien quiso parar el reloj, no romperlo." }] },
  { id: "ev_engranaje", name: "Engranaje de la estrella", place: "torre", category: "mecanismo", time: null, relevance: "alta", related: ["lucien", "santa"],
    desc: "Un engranaje dorado de la sonería con un diente fisurado. A simple vista parece dañado a golpes. Es más pesado y menos brillante de lo que cabría esperar de una pieza centenaria.",
    misreading: "El diente roto parece obra de un sabotaje violento.",
    after: [{ when: ["flag:santa_secret"], desc: "Papá Noel lo ha examinado: carece de la estrella grabada y no brilla con la nieve. Es una copia de latón, y la fisura es fatiga del metal, no un golpe. Alguien sustituyó la pieza original en secreto." }] },
  { id: "ev_huellas", name: "Huellas junto a la puerta", place: "torre", category: "rastro", time: "23:50", relevance: "media", related: ["eloy", "pip", "lucien"],
    desc: "Tres rastros en el umbral. (A) Huellas con clavos, antiguas y medio borradas. (B) Huellas de suela lisa de cuero con una muesca en el talón, llegadas del callejón de la relojería, pisan el escalón ya barrido. (C) Fibras de fieltro rojo enganchadas en el picaporte bajo.",
    misreading: "Los clavos y el fieltro rojo parecen incriminatorios, pero tienen explicación cotidiana." },
  { id: "ev_registro_mant", name: "Registro de mantenimiento", place: "relojeria", category: "documento", time: "22:30", relevance: "alta", related: ["lucien", "pip"],
    desc: "El libro oficial del mecanismo n.º 7. «22:30 — Inspección completa. Sin novedad. L. M.». En octubre hay una anotación tachada: «Pieza sustituida…». También: «17:30 — Entrega del taller: pieza de carillón. Firma: Pip».",
    misreading: "La tachadura podría ser un simple descuido.", events: ["e_insp"] },
  { id: "ev_botas", name: "Botas con el talón remendado", place: "relojeria", category: "objeto", time: null, relevance: "media", related: ["lucien"],
    desc: "Botas de cuero de suela lisa. El talón izquierdo lleva un parche con una muesca. Aún están húmedas de nieve.",
    misreading: "Muchas botas del pueblo son de cuero liso; la muesca es lo que cuenta." },
  { id: "ev_carta_cifrada", name: "Carta cifrada", place: "relojeria", category: "documento", time: null, relevance: "alta", related: ["lucien"],
    desc: "Una hoja escondida en el doble fondo de un cajón, escrita en letras sin sentido. Al margen, con la letra de Lucien: «Clave: n.º del mecanismo». Hay un puzle de cifrado por resolver.",
    misreading: "Podría ser una nota personal sin importancia.",
    after: [{ when: ["flag:cipher_solved"], desc: "Descifrada: «La estrella de la torre se rompió en octubre. La copia de latón no aguantará la campanada de medianoche. Si se rompe ante todos, el pueblo sabrá la verdad. Nadie debe saberlo.»" }] },
  { id: "ev_registro_entregas", name: "Registro de entregas de Nora", place: "correos", category: "documento", time: "23:46", relevance: "alta", related: ["nora", "lucien"],
    desc: "Nora anota cada hora con su reloj, y en la cabecera avisa: «mi reloj atrasa 2 min». Apuntes de esta noche: «23:43 cuartos de la torre. 23:46 Lucien sale de la relojería, con prisa. 23:49 luz en la ventana alta de la torre».",
    misreading: "Si no corriges la hora de su reloj, Lucien parece estar en dos sitios a la vez.", events: ["e_lucien_R", "e_light_correos", "e_bell_correos"] },
  { id: "ev_sobre", name: "Sobre abierto al vapor", place: "correos", category: "documento", time: null, relevance: "media", related: ["nora", "lucien"],
    desc: "Un sobre de la fundición dirigido a L. Moreau, abierto y vuelto a cerrar con cola. Sello del 14 de octubre.",
    misreading: "Que Nora lo abriera no significa que esté implicada en el sabotaje." },
  { id: "ev_paquete", name: "Paquete con etiqueta sospechosa", place: "correos", category: "objeto", time: null, relevance: "media", related: ["lucien"],
    desc: "Un paquete de la fundición Valdés para L. Moreau: «Pasadores de latón Ø 3 mm × 50 uds.». Entregado el 22 de diciembre.",
    misreading: "Un relojero compra pasadores con regularidad: es un indicio de acceso, no una prueba de culpa." },
  { id: "ev_libro_posada", name: "Libro de la posada", place: "posada", category: "documento", time: "23:44", relevance: "alta", related: ["berta", "lucien", "grinch"],
    desc: "«L. Moreau — 23:05 entra, 23:44 sale (dos brandis)». Las horas están anotadas con el reloj de la sala. En una esquina, a lápiz: «hab. 3 — no anotar».",
    misreading: "Si no corriges la hora de la sala, el testimonio de Berta choca con el de Nora.", events: ["e_lucien_I"] },
  { id: "ev_chocolates", name: "Factura de dos chocolates", place: "posada", category: "documento", time: "23:31", relevance: "media", related: ["berta", "madeleine", "anselmo"],
    desc: "Dos chocolates con canela enviados al ayuntamiento «para la alcaldesa y su invitado». Hora de la factura: 23:31 (reloj de la sala).",
    misreading: "El invitado podría ser cualquiera." },
  { id: "ev_diario", name: "Diario de rondas", place: "casa_vigilante", category: "documento", time: "23:48", relevance: "media", related: ["casimiro"],
    desc: "«23:30 plaza. 23:48 torre cerrada, sin novedad. 23:59 plaza.» La entrada de las 23:48 está escrita con otra tinta y el «8» parece un «3» repasado.",
    misreading: "Una tachadura no prueba sabotaje; prueba que alguien quiso ocultar algo pequeño.", events: ["e_cas_log"] },
  { id: "ev_acta", name: "Libro de citas de la alcaldía", place: "ayuntamiento", category: "documento", time: "23:25", relevance: "media", related: ["madeleine", "anselmo"],
    desc: "Con la hora exacta del ayuntamiento: «23:25 — Reunión privada (no registrar). 23:52 — Fin». Entre paréntesis, las iniciales «A. B.».",
    misreading: "Una reunión secreta no es un sabotaje.", events: ["e_acta_mad", "e_acta_ans"] },
  { id: "ev_llaves", name: "Registro del armario de llaves", place: "ayuntamiento", category: "documento", time: null, relevance: "media", related: ["santa", "madeleine"],
    desc: "«20 dic. — Llave de reserva de la torre retirada por N. Claus.» El gancho está vacío.",
    misreading: "La llave desaparecida no es necesariamente la llave usada." },
  { id: "ev_botas_clavos", name: "Botas de trabajo de Eloy", place: "invernadero", category: "objeto", time: null, relevance: "descarte", related: ["eloy"],
    desc: "Botas con suela claveteada, llenas de sal y barro. Coinciden con las huellas (A) de la torre.",
    misreading: "Las huellas con clavos parecen incriminar a Eloy, pero él trabaja en ese camino a diario." },
  { id: "ev_mapa", name: "Plano de caminos", place: "invernadero", category: "documento", time: "17:00", relevance: "descarte", related: ["eloy"],
    desc: "Plano dibujado por Eloy: marca un camino del jardín que une el invernadero con la torre en unos cuatro minutos. Fecha: esta tarde, 17:00.",
    misreading: "El camino parece un atajo perfecto para el saboteador, pero Eloy pasó la noche en la plaza." },
  { id: "ev_carta_anonima", name: "Carta anónima", place: "taller", category: "documento", time: null, relevance: "descarte", related: ["anselmo", "grinch"],
    desc: "«Sé lo de la pintura de los soldaditos. Cuéntaselo a la alcaldesa o lo contaré yo.» Sin firma, con tinta verde.",
    misreading: "El chantaje da un móvil a muchos, pero no a nadie para parar el reloj." },
  { id: "ev_prototipo", name: "Caja de música y nota de Pip", place: "almacen", category: "objeto", time: "23:47", relevance: "descarte", related: ["pip", "santa"],
    desc: "Una caja de música automática con las iniciales «P.» y una nota: «Para Papá Noel — dejada a las 23:47 en el almacén (hora del almacén)».",
    misreading: "Una nota se puede escribir en cualquier momento; lo que cuenta es que Santa lo confirma." },
  { id: "ev_cuaderno", name: "Cuaderno de Papá Noel", place: "almacen", category: "documento", time: null, relevance: "alta", related: ["santa", "lucien"],
    desc: "Notas de 1923: «El engranaje de la estrella lleva grabada una estrella de ocho puntas y brilla con luz dorada al contacto con la nieve. No debe sustituirse jamás.» Más abajo: «La llave de reserva queda bajo llave en mi cajón. Solo existen dos».",
    misreading: "Parece una leyenda familiar, pero explica la pieza y las llaves." },
  { id: "ev_foto", name: "Fotografía del mecanismo (22:50)", place: "plaza", category: "documento", time: "22:50", relevance: "alta", related: ["grinch"],
    desc: "Una fotografía borrosa hecha desde el andamio: la leva de la sonería está libre, sin pasador, y el engranaje no tiene estrella y muestra una fisura. Marca de hora: 22:50.",
    misreading: "Que el Grinch estuviera en el andamio le hace sospechoso, pero la foto demuestra que el pasador aún no estaba." },
];

/* ---------------- timeline events ---------------- */
// kind: seen | departs | span | sound | fact | ref ; claim = said by the person themselves

export const EVENTS = [
  { id: "e_insp", who: "lucien", kind: "seen", place: "torre", t: "22:30", clock: "torre", text: "Lucien inspecciona el mecanismo: «sin novedad»." },
  { id: "e_lucien_claim", who: "lucien", kind: "span", claim: true, place: "relojeria", t: "23:00", t2: "23:57", clock: "torre", text: "Lucien afirma que no salió de la relojería hasta las 23:57." },
  { id: "e_lucien_I", who: "lucien", kind: "departs", place: "posada", t: "23:44", clock: "posada", text: "Libro de la posada: Lucien salió a las 23:44 (reloj de la posada)." },
  { id: "e_lucien_R", who: "lucien", kind: "departs", place: "relojeria", t: "23:46", clock: "correos", text: "Nora vio salir a Lucien de la relojería (reloj de Correos: 23:46)." },
  { id: "e_lucien_P", who: "lucien", kind: "seen", place: "plaza", t: "23:58", clock: "torre", text: "Clara: Lucien llegó a la plaza sin aliento a las 23:58." },
  { id: "e_bell_ref", kind: "ref", group: "bell", place: "torre", t: "23:45", clock: "torre", text: "Los cuartos sonaron con normalidad a las 23:45 exactas (referencia de la torre)." },
  { id: "e_bell_posada", kind: "sound", group: "bell", place: "posada", t: "23:48", clock: "posada", text: "Berta oyó los cuartos cuando su reloj marcaba las 23:48." },
  { id: "e_bell_correos", kind: "sound", group: "bell", place: "correos", t: "23:43", clock: "correos", text: "Nora oyó los cuartos cuando su reloj marcaba las 23:43." },
  { id: "e_bell_ayto", kind: "sound", group: "bell", place: "ayuntamiento", t: "23:45", clock: "ayuntamiento", text: "Madeleine oyó los cuartos con su reloj en las 23:45." },
  { id: "e_light_correos", kind: "fact", group: "light", place: "torre", t: "23:49", clock: "correos", text: "Nora vio luz en la sala de máquinas (reloj de Correos: 23:49)." },
  { id: "e_light_posada", kind: "fact", group: "light", place: "torre", t: "23:54", clock: "posada", text: "Berta vio luz en la sala de máquinas (reloj de la posada: 23:54)." },
  { id: "e_click", kind: "fact", place: "torre", t: "23:53", clock: "torre", text: "Clara oyó un chasquido metálico en lo alto de la torre a las 23:53." },
  { id: "e_cas_log", who: "casimiro", kind: "seen", claim: false, place: "torre", t: "23:48", clock: "vigilante", text: "Diario de Casimiro: «23:48 torre cerrada, sin novedad»." },
  { id: "e_cas_inn", who: "casimiro", kind: "span", place: "posada", t: "23:46", t2: "23:59", clock: "posada", text: "Berta: el vigilante estuvo en su cocina de 23:46 a 23:59 (reloj de la posada)." },
  { id: "e_anselmo_claim", who: "anselmo", kind: "span", claim: true, place: "taller", t: "23:00", t2: "23:55", clock: "torre", text: "Anselmo afirma que estuvo en el taller toda la noche." },
  { id: "e_pip_says", who: "anselmo", kind: "departs", place: "taller", t: "23:20", clock: "torre", text: "Pip: Anselmo salió del taller a las 23:20 «a tomar el aire»." },
  { id: "e_madeleine_claim", who: "madeleine", kind: "span", claim: true, place: "ayuntamiento", t: "23:00", t2: "23:55", clock: "torre", text: "Madeleine afirma haber estado sola en su despacho." },
  { id: "e_acta_mad", who: "madeleine", kind: "span", place: "ayuntamiento", t: "23:25", t2: "23:52", clock: "ayuntamiento", text: "Libro de citas: reunión privada de 23:25 a 23:52." },
  { id: "e_acta_ans", who: "anselmo", kind: "span", place: "ayuntamiento", t: "23:25", t2: "23:52", clock: "ayuntamiento", text: "Libro de citas: «A. B.» asistió a esa reunión." },
  { id: "e_pip_S", who: "pip", kind: "span", place: "almacen", t: "23:38", t2: "23:50", clock: "torre", text: "Papá Noel: Pip estuvo en el almacén de 23:38 a 23:50." },
  { id: "e_eloy_P", who: "eloy", kind: "span", place: "plaza", t: "23:43", t2: "00:10", clock: "torre", text: "Clara: Eloy colocó la estrella en el árbol de la plaza hasta pasada la medianoche." },
  { id: "e_nora_P", who: "nora", kind: "seen", place: "plaza", t: "23:53", clock: "torre", text: "Clara: Nora entregó un paquete al coro a las 23:53." },
];

/* ---------------- deductions ---------------- */

export const DEDUCTIONS = [
  { id: "d_keys", requires: ["ev_llaves", "ev_cuaderno"], conclusion: "La llave de reserva nunca salió del almacén: solo la llave de Lucien pudo abrir la puerta sin forzarla.", sets: ["only_k1"] },
  { id: "d_meeting", requires: ["ev_chocolates", "ev_acta"], conclusion: "Madeleine y Anselmo se reunieron en secreto en el ayuntamiento: su mentira oculta una reunión, no un sabotaje.", sets: ["meeting_deduced"] },
  { id: "d_grinch", requires: ["ev_foto", "ev_libro_posada"], conclusion: "El Grinch subió al andamio a las 22:50, pero pasó la noche en la posada: investigó, no saboteó.", sets: ["grinch_cleared"] },
  { id: "d_pin", requires: ["ev_pasador", "ev_paquete"], conclusion: "El pasador es de un tipo que Lucien compró hace días: tenía acceso al medio, aunque otro relojero también podría tenerlo.", sets: ["pin_source"] },
  { id: "d_time", requires: ["ev_registro_entregas", "ev_libro_posada"], needsFlags: ["timeline_solved"], conclusion: "Con las horas corregidas, Lucien salió de la posada a las 23:41 y de la relojería a las 23:48: pudo llegar a la torre a las 23:50.", sets: ["lucien_opportunity"] },
  { id: "d_copy", requires: ["ev_engranaje", "ev_carta_cifrada"], needsFlags: ["cipher_solved", "santa_secret"], conclusion: "El engranaje es una copia que Lucien colocó en secreto: su motivo era ocultar esa reparación.", sets: ["copy_motive"] },
  { id: "d_diary", requires: ["ev_diario", "ev_libro_posada"], needsFlags: ["travel_solved"], conclusion: "Casimiro falseó su diario para ocultar que abandonó su puesto: no estuvo cerca de la torre en el momento clave.", sets: ["casimiro_cleared"] },
  { id: "d_pip", requires: ["ev_prototipo", "ev_registro_mant"], conclusion: "Las fibras de Pip vienen de su entrega de las 17:30 y a la hora clave estaba en el almacén de Papá Noel.", sets: ["pip_cleared"] },
  { id: "d_eloy", requires: ["ev_botas_clavos", "ev_mapa"], conclusion: "Las huellas con clavos y el camino del jardín son del trabajo de Eloy: no lo sitúan en la torre a la hora clave.", sets: ["eloy_cleared"] },
];

export const FALSE_CONCLUSIONS = [
  "El Grinch saboteó el reloj por su odio a la Navidad.",
  "Papá Noel retiró la llave para sabotear el reloj.",
  "Alguien del taller forzó la puerta con una palanca.",
  "Pip colocó el pasador para vengarse de Anselmo.",
  "Madeleine detuvo el reloj para evitar un escándalo.",
  "Eloy usó el camino del jardín para llegar a la torre.",
];

/* ---------------- puzzles ---------------- */

export const PUZZLES = [
  { id: "travel", title: "El diario imposible", needs: ["ev:ev_diario"], lockedText: "Aún no has visto ningún diario de rondas.",
    intro: "El diario de Casimiro dice «23:48 torre cerrada». Berta lo sitúa en su cocina desde las 23:43 (hora real) hasta las 23:56. Usa el planificador de rutas del mapa.",
    hints: ["No todas las entradas del diario pueden ser verdaderas a la vez: compáralas con lo que dice la posadera.", "Usa el planificador: de la torre a la posada, ¿cuántos minutos necesita como mínimo?", "De la torre a la posada hay 5 minutos (torre → plaza → posada). Un hombre en la cocina de la posada desde las 23:43 no pudo estar en la torre a las 23:48: una entrada es falsa."] },
  { id: "clocks", title: "Los relojes desajustados", needs: ["ev:ev_libro_posada"], lockedText: "Aún no tienes testimonios con horas que comparar.",
    intro: "Berta y Nora anotan las horas con sus propios relojes. Los tres testigos oyeron los mismos cuartos de las 23:45. Ajusta cada reloj.",
    hints: ["No todas las declaraciones utilizan la misma referencia horaria.", "Compara cómo oyeron los testigos los cuartos de las 23:45: todos oyeron lo mismo, pero sus relojes dicen horas distintas.", "La posada adelanta 3 minutos y Correos atrasa 2. Corrige cada hora antes de calcular desplazamientos."] },
  { id: "cipher", title: "La carta cifrada", needs: ["ev:ev_carta_cifrada", "ev:ev_registro_mant"], lockedText: "Necesitas la carta cifrada y el registro de mantenimiento.",
    intro: "Cada letra está desplazada un número fijo. Al margen: «Clave: n.º del mecanismo».",
    hints: ["La carta no está en otra lengua: cada letra ha sido desplazada un número fijo de posiciones.", "Busca en el registro de mantenimiento un número que identifique al mecanismo.", "El registro habla del mecanismo n.º 7: desplaza cada letra siete posiciones hacia atrás."] },
  { id: "traces", title: "Los tres rastros", needs: ["ev:ev_huellas", "ev:ev_botas", "ev:ev_botas_clavos", "ev:ev_registro_mant"], lockedText: "Aún te faltan pruebas para comparar los rastros (botas, registro y huellas).",
    intro: "Junto a la puerta hay tres rastros: huellas con clavos, fibras de fieltro rojo y huellas lisas con muesca. Asigna cada uno a su dueño.",
    hints: ["Cada rastro pertenece a alguien que tuvo una razón, legítima o no, para pisar ahí.", "Busca unas botas con clavos, una entrega documentada de las 17:30 y una bota con un parche en el talón.", "Los clavos son de las botas de Eloy, las fibras rojas del gorro de Pip (entrega de las 17:30) y la muesca del talón coincide con la bota remendada de la relojería."] },
  { id: "cross", title: "Tres testimonios", needs: ["ev:ev_chocolates", "flag:pip_says", "flag:met:madeleine"], lockedText: "Necesitas hablar con Madeleine y con Pip, y conocer la factura de los chocolates.",
    intro: "Madeleine dice estar sola. Anselmo dice estar con Pip. Pip dice que Anselmo se marchó. Hay dos chocolates en la cuenta de la posada. ¿Quién estuvo con Madeleine, y dónde?",
    hints: ["Una persona dice estar sola, otra dice estar acompañada, y alguien ve irse a un tercero: los testimonios no cuadran por separado.", "Dos chocolates fueron al ayuntamiento. ¿Quién había abandonado su puesto poco antes?", "Pip vio salir a Anselmo a las 23:20 y los chocolates fueron a la alcaldesa y su invitado: Anselmo y Madeleine se reunieron en el ayuntamiento."] },
  { id: "sequence", title: "El último campanazo", needs: ["flag:cipher_solved", "flag:timeline_solved", "ev:ev_cuaderno"], lockedText: "Antes de reconstruir la noche necesitas descifrar la carta, ajustar los relojes y conocer el secreto de Papá Noel.",
    intro: "Ordena los hechos de la noche con sus horas reales.",
    hints: ["Cada hecho tiene una hora corregida: úsala para ordenar.", "Recuerda que el Grinch fotografió el mecanismo antes de que se colocase el pasador, y que Lucien salió de la posada antes de salir de la relojería.", "La secuencia va de la inspección de las 22:30 a la detención de las 00:00. Lucien sale de la posada a las 23:41, de la relojería a las 23:48 y llega a la torre a las 23:50."] },
];

export const SEQUENCE_ITEMS = [
  { id: "s_insp", text: "22:30 — Lucien inspecciona el mecanismo y anota «sin novedad»." },
  { id: "s_foto", text: "22:50 — El Grinch fotografía la sala de máquinas desde el andamio: la leva está libre." },
  { id: "s_posada", text: "23:41 — Lucien sale de la posada rumbo a la relojería." },
  { id: "s_relojeria", text: "23:48 — Lucien sale de la relojería por el callejón hacia la torre." },
  { id: "s_torre", text: "23:50 — Lucien abre la torre con su llave y entra en la sala de máquinas." },
  { id: "s_pasador", text: "23:53 — Un pasador de latón queda encajado en la leva (el chasquido)." },
  { id: "s_plaza", text: "23:58 — Lucien llega sin aliento a la plaza." },
  { id: "s_stop", text: "00:00 — La sonería se bloquea y el reloj se detiene." },
];

export const TRACE_OWNERS = ["anselmo", "lucien", "pip", "eloy", "grinch", "casimiro"];
export const TRACES = [
  { id: "clavos", label: "Huellas con clavos" },
  { id: "fieltro", label: "Fibras de fieltro rojo" },
  { id: "tacon", label: "Huellas lisas con muesca en el talón" },
];

/* ---------------- accusation options ---------------- */

export const METHODS = [
  { id: "forzar", text: "Forzó la cerradura de la puerta de mantenimiento con una palanca." },
  { id: "llave_pasador", text: "Entró con una llave auténtica y bloqueó la leva de la sonería con un pasador de latón." },
  { id: "ventana", text: "Trepó por el exterior de la torre hasta la ventana de la sala de máquinas." },
  { id: "pendulo", text: "Detuvo el péndulo desde el sótano usando un túnel." },
  { id: "cable", text: "Cortó el cable de la iluminación de la esfera." },
];
export const INTERVALS = [
  { id: "23:00-23:20", text: "Entre las 23:00 y las 23:20" },
  { id: "23:20-23:45", text: "Entre las 23:20 y las 23:45" },
  { id: "23:45-23:57", text: "Entre las 23:45 y las 23:57" },
  { id: "23:57-00:00", text: "Entre las 23:57 y las 00:00" },
];
export const EXPLANATIONS = [
  { id: "sin_testigos", text: "No tenía testigos de su coartada, y eso demuestra que mintió." },
  { id: "salida_relojeria", text: "Dijo que no salió de la relojería hasta las 23:57, pero con las horas corregidas salió a las 23:48 y la torre está a solo 2 minutos." },
  { id: "huellas_clavos", text: "Sus botas llevan clavos como las huellas junto a la puerta." },
  { id: "llave_robada", text: "Dijo que le robaron la llave de reserva, luego debe ser culpable." },
  { id: "reloj_atrasado", text: "Su reloj atrasaba dos minutos, por eso llegó tarde a la plaza." },
  { id: "mintio_posada", text: "Mintió sobre la posada, así que sabotear era inevitable." },
];

export const VICTORY = [
  "Las campanas vuelven a sonar. La nieve se ilumina con pequeñas luces doradas y, una a una, las casas se encienden.",
  "Lucien lo confiesa todo: la estrella original se rompió en octubre, la sustituyó en secreto y, esa noche, comprendió que la copia no resistiría la campanada. Prefirió detener el reloj antes que verlo destrozarse ante el pueblo.",
  "Papá Noel reconoce tu brillante investigación y te entrega una llave dorada. «Con esta llave podrás abrir el gran reloj. Solo necesita el código».",
];
