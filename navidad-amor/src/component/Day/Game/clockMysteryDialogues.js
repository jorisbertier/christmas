/* ------------------------------------------------------------------ */
/*  Interrogations. For every topic the LAST variant whose `when`      */
/*  tokens are satisfied is used. Effects: sets (flags), gives         */
/*  (evidence ids), events (timeline event ids).                       */
/* ------------------------------------------------------------------ */

export const DIALOGUES = {
  anselmo: {
    intro: "Anselmo Brandt se limpia las manos manchadas de pintura en el delantal. «Tres generaciones fabricando juguetes en este pueblo, investigadora. No pienso dejar que nadie manche el apellido Brandt.»",
    topics: [
      { id: "where", q: "¿Dónde estabas a las 23:40?", a: [
        { t: "«En mi taller, rematando los últimos regalos. Pip estuvo conmigo toda la noche; pregúntele.»", sets: ["anselmo_claim"], events: ["e_anselmo_claim"] },
        { when: ["flag:pip_says"], t: "«Pip entraba y salía... Yo estaba concentrado en la pintura, no miro el reloj cada cinco minutos. Quizá me ausenté un momento a tomar el aire.»", sets: ["anselmo_claim"], events: ["e_anselmo_claim"] },
        { when: ["flag:anselmo_met"], t: "«En el ayuntamiento, con Madeleine, de 23:25 a 23:52. Mentí, y me avergüenza. Pero no puse un pie en la torre.»", events: ["e_anselmo_claim"] },
      ] },
      { id: "confirm", q: "¿Quién puede confirmar tu coartada?", a: [
        { t: "«Pip, mi ayudante. Es un buen chico, algo despistado, pero no miente.»" },
        { when: ["flag:pip_says"], t: "«...Pip salió un rato, sí. Supongo que mi coartada es más débil de lo que creía.»" },
        { when: ["flag:anselmo_met"], t: "«Madeleine, su libro de citas y esa factura de chocolates que usted ya conoce. Un hombre honrado también puede tener miedo.»" },
      ] },
      { id: "letter", q: "¿Qué sabes de esta carta anónima?", needs: ["ev:ev_carta_anonima"], a: [
        { t: "«Un chantaje cobarde. Alguien dice saber que usé una pintura que no debía en unos soldaditos. Fue un error de proveedor. Por eso necesitaba hablar con la alcaldesa...»", sets: ["anselmo_letter"] },
      ] },
      { id: "pip", q: "¿Qué relación tienes con Pip?", a: [
        { t: "«Es mi aprendiz. Tiene ideas curiosas. Esa caja de música suya la perfeccioné yo; el taller es mío y las patentes también.»", sets: ["pip_invention"] },
      ] },
    ],
    present: {
      ev_carta_anonima: [{ t: "«Eso es mío... ¿de dónde lo ha sacado? Está bien, la leí. No tiene nada que ver con el reloj.»", sets: ["anselmo_letter"] }],
      ev_chocolates: [{ t: "«Dos chocolates con canela... Está bien, está bien. Esa noche estuve en el ayuntamiento.»", sets: ["anselmo_met"] }],
      ev_acta: [{ t: "«El libro de citas de Madeleine. De 23:25 a 23:52. No hay más que decir: yo estaba allí.»", sets: ["anselmo_met"] }],
      ev_huellas: [{ t: "«Mis botas son de goma, y esta noche no he pisado la nieve de la torre.»" }],
    },
    fallback: "«No sé qué quiere que le diga de eso. Yo hago juguetes, no relojes.»",
  },

  lucien: {
    intro: "Lucien Moreau ni siquiera levanta la vista del cronómetro que está puliendo. «Si viene a decirme que mi reloj no funciona, ya lo sé. Es mi reloj.»",
    topics: [
      { id: "where", q: "¿Dónde estabas a las 23:40?", a: [
        { t: "«Aquí, en mi relojería, afinando las herramientas para la campanada. No salí hasta las 23:57. Pregunte a quien quiera.»", sets: ["lucien_claim"], events: ["e_lucien_claim"] },
        { when: ["flag:lucien_inn"], t: "«Está bien: pasé un rato en la posada. Un brandy, nada más. Después volví a mi taller y no me moví de él hasta las 23:57. Eso es lo único que importa.»", events: ["e_lucien_claim"] },
      ] },
      { id: "confirm", q: "¿Quién puede confirmar tu coartada?", a: [
        { t: "«Un relojero trabaja solo. Esa es la gracia del oficio.»" },
        { when: ["flag:lucien_inn"], t: "«Berta me vio salir de la posada. Después, nadie. ¿Qué esperaba, un testigo por cada minuto?»" },
      ] },
      { id: "tower", q: "¿Has estado cerca de la torre?", a: [
        { t: "«Revisé el mecanismo a las 22:30, como cada Nochebuena. Sin novedad; está en mi registro. Después, ni me acerqué.»", sets: ["lucien_inspected"], events: ["e_insp"] },
        { when: ["ev:ev_engranaje"], t: "«Revisé el mecanismo a las 22:30 y estaba todo en orden. Ese diente roto es obra de un bruto con una palanca; yo no habría tocado esa pieza ni con guantes.»", events: ["e_insp"] },
      ] },
      { id: "key", q: "¿Y la llave que ha desaparecido?", a: [
        { t: "«La de reserva, la del ayuntamiento. Alguien la robó. La mía la llevo siempre en el cinturón; lo sabe todo el pueblo.»", sets: ["lucien_key_belt"] },
        { when: ["ev:ev_llaves"], t: "«¿Papá Noel? Vaya... entonces la de reserva ni se perdió. Pues sí: nadie más que yo tenía llave en este pueblo. No pretenda insinuar nada, investigadora.»" },
      ] },
      { id: "repair", q: "¿Has hecho alguna reparación reciente?", needs: ["ev:ev_registro_mant"], a: [
        { t: "«Mantenimiento rutinario. Todo lo que importa figura en el registro.»" },
        { when: ["flag:cipher_solved"], t: "«...Esa carta. Muy bien: sustituí la estrella en octubre, porque se rompió. Una reparación sin registrar no es un crimen. Y no demuestra que yo haya detenido nada.»", sets: ["lucien_repair"] },
      ] },
    ],
    present: {
      ev_registro_mant: [{ t: "«Mi registro es impecable. Esa tachadura de octubre... un descuido de escritura.»" }],
      ev_libro_posada: [{ t: "«Está bien. Pasé un rato en la posada. Un solo brandy. No me parecía asunto de nadie.»", sets: ["lucien_inn"] }],
      ev_huellas: [{ t: "«Huellas. Esta noche medio pueblo ha pisado esa nieve.»" }],
      ev_botas: [{ t: "«Mis botas, sí. Las llevo a diario. No sabía que fuera delito calzarse.»", sets: ["lucien_boots"] }],
      ev_pasador: [{ t: "«Un pasador de latón torneado. Cualquiera con un torno podría haberlo hecho. No es una pieza exclusiva mía.»" }],
      ev_paquete: [{ t: "«Compro pasadores cada trimestre. Soy relojero, ¿recuerda?»" }],
      ev_registro_entregas: [
        { t: "«Nora y su reloj atrasado... Se equivoca de hora o de persona. Yo no salí.»" },
        { when: ["flag:timeline_solved"], t: "«...Salí un momento. A tomar el aire. Eso no significa nada.»", sets: ["lucien_left"] },
      ],
      ev_carta_cifrada: [
        { t: "«Eso es mío. ¿Cómo...? No sé de qué habla. Son papeles viejos.»" },
        { when: ["flag:cipher_solved"], t: "«...Entonces ya lo sabe. La estrella se rompió y yo la sustituí. Lo demás, investigadora, tendrá que demostrarlo.»", sets: ["lucien_repair"] },
      ],
      ev_engranaje: [
        { t: "«Un engranaje dañado. Es lo que le decía: lo forzaron.»" },
        { when: ["flag:santa_secret"], t: "«¿Una copia? ¿Quién dice eso? Papá Noel ya es muy mayor...»" },
      ],
    },
    fallback: "«No veo en qué me concierne eso.»",
  },

  madeleine: {
    intro: "Madeleine Fontaine recibe a la visitante con una sonrisa perfecta y unos ojos agotados. «La Navidad no puede esperar, pero el reloj parece que sí. Confío en su discreción, investigadora.»",
    topics: [
      { id: "where", q: "¿Dónde estabas a las 23:40?", a: [
        { t: "«En mi despacho, repasando el discurso de medianoche. Sola. A las 23:55 salí hacia la plaza a recibir a los vecinos.»", events: ["e_madeleine_claim"] },
        { when: ["ev:ev_chocolates"], t: "«En mi despacho, con una cena ligera, de esas que se piden a la posada. A las 23:55 salí hacia la plaza.»", events: ["e_madeleine_claim"] },
        { when: ["flag:anselmo_met"], t: "«En mi despacho, sí, pero no sola: con Anselmo Brandt, de 23:25 a 23:52. Me pidió que renovara su contrato sin escándalo. Desear discreción no es un delito; mentir sobre ello es feo.»", sets: ["madeleine_meeting"] },
      ] },
      { id: "confirm", q: "¿Quién puede confirmar tu coartada?", a: [
        { t: "«Mi secretaria se fue a las nueve. Nadie, desgraciadamente.»" },
        { when: ["flag:anselmo_met"], t: "«Anselmo, el libro de citas y esa factura de chocolates. No es un secreto de Estado, pero sí de reputación.»" },
      ] },
      { id: "bell", q: "¿Oíste los cuartos de las 23:45?", a: [
        { t: "«Perfectamente. Mi reloj de pared, que se ajusta cada semana, marcaba las 23:45 justas.»", sets: ["clock_ayto"], events: ["e_bell_ayto"] },
      ] },
      { id: "key", q: "¿Quién tiene llave de la torre?", a: [
        { t: "«Dos: la de Lucien y la de reserva, que guardo en el armario del ayuntamiento. Al volver de la plaza vi el gancho vacío.»", sets: ["key_missing_known"] },
        { when: ["ev:ev_llaves"], t: "«Papá Noel firmó la retirada el 20 de diciembre; lo había olvidado por completo.»" },
      ] },
      { id: "irregular", q: "¿Qué irregularidad temías que se descubriera?", needs: ["flag:anselmo_met"], a: [
        { t: "«Una reunión nocturna sin acta con un contratista al que no debía favorecer. Nada más. Le juro que no toqué ese reloj.»", sets: ["madeleine_confessed"] },
      ] },
    ],
    present: {
      ev_chocolates: [{ t: "«Dos chocolates... Ya no tiene sentido negarlo: no estaba sola.»", sets: ["anselmo_met"] }],
      ev_acta: [{ t: "«Mi libro de citas. Sí, de 23:25 a 23:52 y, entre paréntesis, las iniciales de Anselmo. Lo anoté yo misma, qué ironía.»", sets: ["anselmo_met"] }],
      ev_llaves: [{ t: "«Papá Noel... lo había olvidado por completo.»", sets: ["key_missing_known"] }],
    },
    fallback: "«Eso no forma parte de mi agenda oficial.»",
  },

  nora: {
    intro: "Nora Quill clasifica sobres con una rapidez de prestidigitadora. «Todo el mundo pregunta por mis cartas, nadie por mis pies. Llevo desde las seis repartiendo. ¿Qué quiere saber?»",
    topics: [
      { id: "where", q: "¿Dónde estabas a las 23:40?", a: [
        { t: "«Aquí, en Correos, cerrando el reparto. A las 23:52 salí hacia la plaza con un paquete para el coro.»" },
      ] },
      { id: "saw", q: "¿Viste algo desde Correos?", a: [
        { t: "«Desde la puerta se ve la relojería. Vi salir a Lucien con prisa... y poco después, una luz en la ventana alta de la torre. No me pida horas exactas de memoria: lo apunto todo en mi registro de entregas.»", sets: ["light_rumor", "nora_hint"] },
      ] },
      { id: "clock", q: "¿Tu reloj va en hora?", a: [
        { t: "«El de Correos va dos minutos retrasado, siempre. Lo dejo escrito en la cabecera del registro para no equivocarme.»", sets: ["clock_correos"] },
      ] },
      { id: "others", q: "¿Viste moverse a alguien más?", needs: ["flag:light_rumor"], a: [
        { t: "«A Pip, corriendo hacia el almacén de Papá Noel con una caja bajo el brazo, hacia las 23:35. Y a Eloy, colocando adornos en la plaza.»", sets: ["pip_left"] },
      ] },
    ],
    present: {
      ev_sobre: [{ t: "«Está bien... abrí un sobre de la fundición dirigido a Lucien el 14 de octubre. Hablaba de una «estrella nueva» y de «guardar el secreto». No lo entendí, pero me dio mala espina. Si busca más, Lucien guarda papeles bajo el doble fondo de su cajón.»", sets: ["nora_read_letter"] }],
      ev_registro_entregas: [{ t: "«Mi registro, sí. Cada letra y cada hora tal como las vi, con la hora de mi reloj.»" }],
      ev_paquete: [{ t: "«El paquete de pasadores para Lucien. Lo entregué el 22; pesaba como un ladrillo.»" }],
      ev_carta_anonima: [{ t: "«Esa letra no ha pasado por mis manos... y eso que lo veo todo.»" }],
    },
    fallback: "«No me suena de nada, y suelo acordarme de todo.»",
  },

  pip: {
    intro: "Pip salta de un taburete cuando te ve y tira un puñado de tuercas. «¡No fui yo! ¡Bueno, sí fui, pero no a la torre! ¡No me mire así!»",
    topics: [
      { id: "where", q: "¿Dónde estabas a las 23:40?", a: [
        { t: "«En el taller. Todo el rato. Con el señor Brandt.»" },
        { when: ["flag:pip_left"], t: "«Salí un momento a... tomar el aire. No pisé la torre, lo juro por mis campanillas.»" },
        { when: ["flag:pip_santa"], t: "«Fui al almacén de Papá Noel. Le llevé mi caja de música automática para que viera que el invento es mío. Llegué a las 23:38 y me fui a las 23:50.»" },
      ] },
      { id: "santa", q: "¿Adónde fuiste exactamente?", needs: ["flag:pip_left"], a: [
        { t: "«Al almacén de Papá Noel. Le llevé mi invento: el señor Brandt dice que es suyo, y Papá Noel es el único que me escucha. Llegué a las 23:38 y me fui a las 23:50. Pregúntele.»", sets: ["pip_santa"] },
      ] },
      { id: "brandt", q: "¿Dónde estaba Anselmo?", a: [
        { t: "«Salió a las 23:20 «a tomar el aire». Cuando me fui yo, aún no había vuelto.»", sets: ["pip_says", "pip_left"], events: ["e_pip_says"] },
      ] },
      { id: "invention", q: "¿Qué es esa invención?", a: [
        { t: "«Una caja de música que toca sola al abrirse. La diseñé yo, con mis noches sin dormir. ¡Y ahora dice que es suya!»", sets: ["pip_invention"] },
      ] },
    ],
    present: {
      ev_huellas: [{ t: "«¿Fieltro rojo? Mi gorro suelta pelusa por todas partes. Entregué la pieza del carillón el miércoles a las 17:30 en la torre; Lucien me la firmó.»", sets: ["pip_delivery"] }],
      ev_registro_mant: [{ t: "«Mi firma de la entrega de las 17:30, sí. Ahí dejé mi pelusa, seguro.»", sets: ["pip_delivery"] }],
      ev_prototipo: [{ t: "«¡Mi caja! La dejé en el almacén a las 23:47, antes de irme. Papá Noel la miró un buen rato.»", sets: ["pip_santa"] }],
      ev_carta_anonima: [{ t: "«¿Esa carta? No es mía. Yo escribo con mejor letra y menos mala leche.»" }],
    },
    fallback: "«¡Yo no sé nada de eso, de verdad!»",
  },

  berta: {
    intro: "Berta limpia una jarra con parsimonia. «En esta posada se oye todo, querida. Pero lo que se oye aquí, aquí se queda... normalmente.»",
    topics: [
      { id: "where", q: "¿Dónde estabas a las 23:40?", a: [
        { t: "«Detrás de la barra. Toda la noche, con la sala llena.»" },
      ] },
      { id: "who", q: "¿Quién estuvo por aquí esta noche?", a: [
        { t: "«Lucien tomó un par de brandis desde poco después de las once. Salió a las 23:44 según mi reloj, apresurado, sin acabar el segundo.»", events: ["e_lucien_I"] },
      ] },
      { id: "saw", q: "¿Viste algo desde la ventana?", a: [
        { t: "«Desde que Eloy cortó esa rama baja esta tarde, se ve la torre entera. Hacia las 23:54 vi encenderse la ventana alta de la sala de máquinas.»", sets: ["light_rumor"], events: ["e_light_posada"] },
      ] },
      { id: "clock", q: "¿Tu reloj va en hora?", a: [
        { t: "«Va tres minutos adelantado, a propósito: así mis clientes no se pasan de hora. Lo sabe todo el pueblo. Los cuartos de la torre los oí a las 23:48 de mi reloj.»", sets: ["clock_posada"], events: ["e_bell_posada"] },
      ] },
      { id: "vigilante", q: "¿Estuvo el vigilante por aquí?", needs: ["flag:diary_mentioned"], a: [
        { t: "«Casimiro entró por la cocina a las 23:46 de mi reloj, a por un café y una empanada. Se fue a las 23:59. Prefiero no meterle en problemas, pero no mentiré.»", sets: ["casimiro_ate"], events: ["e_cas_inn"] },
      ] },
      { id: "guest", q: "¿Alguien se aloja sin registrar?", needs: ["ev:ev_libro_posada"], a: [
        { t: "«Mis huéspedes están todos en el libro.»" },
        { when: ["flag:grinch_seen"], t: "«Está bien. Habitación 3: quería pasar desapercibido y yo prometí discreción. Llegó a las 23:05, empapado de nieve, y no volvió a salir. Le subí la cena a las 23:40 y a medianoche seguía allí.»", sets: ["grinch_room"] },
      ] },
      { id: "choco", q: "¿Enviaste algo al ayuntamiento?", needs: ["ev:ev_chocolates"], a: [
        { t: "«Sí: dos chocolates con canela para la alcaldesa y su invitado, a las 23:31 por mi reloj. No pregunté quién era el invitado; ahí está mi discreción.»" },
      ] },
    ],
    present: {
      ev_libro_posada: [{ t: "«Mi libro, con la hora de mi reloj, que va adelantado. Recuérdelo al comparar horas.»", sets: ["clock_posada"] }],
      ev_diario: [{ t: "«El vigilante... sí, comió en mi cocina. Prefiero no meterle en problemas, pero no mentiré.»", sets: ["casimiro_ate"], events: ["e_cas_inn"] }],
      ev_foto: [{ t: "«Eso es el andamio de la torre... y esa figura con el abrigo lleno de óxido duerme en mi habitación 3. Está bien, se lo cuento: llegó a las 23:05 y no volvió a salir.»", sets: ["grinch_room"] }],
      ev_chocolates: [{ t: "«Mi cocina. Dos chocolates para el ayuntamiento, sí.»" }],
    },
    fallback: "«Eso no pasó por mi barra.»",
  },

  eloy: {
    intro: "Eloy no deja de podar una orquídea mientras habla. «La nieve es sincera, investigadora. Lo que se pisa, se queda.»",
    topics: [
      { id: "where", q: "¿Dónde estabas a las 23:40?", a: [
        { t: "«Hasta las 23:41 barrí el escalón de la torre y el camino. Después ayudé a poner la última estrella al árbol de la plaza, con el coro. De allí no me moví hasta pasada la medianoche.»", sets: ["eloy_where"], events: ["e_eloy_P"] },
      ] },
      { id: "bell", q: "¿Recuerdas los cuartos de las 23:45?", a: [
        { t: "«Sonaron perfectos, en punto, por el reloj de la torre. Se los oí desde la plaza, junto al árbol.»", events: ["e_bell_ref"] },
      ] },
      { id: "path", q: "¿Has modificado algún camino?", a: [
        { t: "«Poda de rutina, nada más.» " },
        { when: ["ev:ev_mapa"], t: "«Corté una rama baja del abeto de la torre y despejé el camino del jardín esta tarde, para llevar las luces. Ahora se ve la puerta de la torre desde la posada y el camino del invernadero llega a la torre en unos cuatro minutos.»", sets: ["eloy_cut_branch"] },
      ] },
      { id: "dispute", q: "¿Tienes algún conflicto con la alcaldía?", a: [
        { t: "«Madeleine quiere derribar mi invernadero para ampliar la plaza. Eso no es motivo para romper un reloj: es motivo para presentar una queja.»", sets: ["eloy_dispute"] },
      ] },
    ],
    present: {
      ev_huellas: [{ t: "«Esos clavos son de mis botas. Anduve por ahí hasta las 23:41 barriendo. Fíjese: las huellas lisas pisan encima del escalón ya barrido. Eso es posterior.»", sets: ["eloy_prints"] }],
      ev_botas_clavos: [{ t: "«Mis botas de trabajo, claro. ¿Quién si no tiene clavos así?»", sets: ["eloy_prints"] }],
      ev_mapa: [{ t: "«Mi plano. Lo dibujé hoy para las luces. El camino es un atajo, pero esta noche no lo pisé.»", sets: ["eloy_cut_branch"] }],
    },
    fallback: "«No sé decirle. La tierra sabe más que yo.»",
  },

  casimiro: {
    intro: "Casimiro Vega se ha plantado frente a la puerta con la linterna en alto. «Nadie pasa. Es mi puesto. Y mi puesto es lo único serio que queda en este pueblo.»",
    topics: [
      { id: "where", q: "¿Dónde estabas a las 23:40?", a: [
        { t: "«Hice mis rondas como siempre: plaza a las 23:30, torre a las 23:48 y de nuevo plaza para la campanada. Todo está en mi diario.»", sets: ["diary_mentioned"] },
      ] },
      { id: "diary", q: "¿Puedo ver tu diario?", a: [
        { t: "«Está en mi casa, sobre el escritorio. Cójalo, no tengo nada que ocultar.»", sets: ["diary_mentioned"] },
      ] },
      { id: "key", q: "¿Quién puede abrir la puerta de la torre?", a: [
        { t: "«Yo solo tengo la llave del candado exterior. La puerta del mecanismo solo la abre la llave de Lucien... y la de reserva del ayuntamiento.»", sets: ["key_info"] },
      ] },
      { id: "worry", q: "¿Temes perder tu puesto?", a: [
        { t: "«Si esta noche pasa algo en mi guardia, me jubilan a la fuerza. Treinta años sin una falta... y ahora esto.»" },
      ] },
    ],
    present: {
      ev_diario: [
        { t: "«Eso es mi letra. Los tiempos son los que son.»" },
        { when: ["flag:casimiro_ate"], t: "«...Está bien. Salí del puesto unos minutos a comer algo en la posada. Y anoté la ronda de las 23:45 después, con la hora que tocaba. No fue sabotaje: fue vergüenza.»", sets: ["casimiro_confessed"] },
      ],
      ev_llaves: [{ t: "«Papá Noel... nadie piensa mal de Papá Noel.»" }],
    },
    fallback: "«No es asunto de mi ronda.»",
  },

  santa: {
    intro: "Papá Noel levanta la vista de un libro de cuentas con una calma que contagia. «Sé a qué has venido, pequeña. Siéntate. El tiempo es un invitado extraño esta noche.»",
    topics: [
      { id: "where", q: "¿Dónde estabas a las 23:40?", a: [
        { t: "«En mi almacén, preparando el trineo. Pip vino a verme un rato; es un buen muchacho.»", sets: ["santa_where"] },
      ] },
      { id: "pip", q: "¿Estuvo Pip contigo?", a: [
        { t: "«Llegó a las 23:38 con una caja de música y se fue a las 23:50. Hablamos de inventos y de quién es dueño de las ideas.»", sets: ["pip_santa"], events: ["e_pip_S"] },
      ] },
      { id: "clock", q: "¿Por qué es tan importante este reloj?", a: [
        { t: "«Es la tradición, querida. Cuando suena la medianoche, las casas se encienden.»" },
        { when: ["ev:ev_engranaje"], t: "«Hace cien años forjé el engranaje de la estrella con un fragmento de la luz de Belén y lo regalé al pueblo con una condición: que jamás lo reemplazaran. Desde octubre noto la estrella apagada. Esa pieza que me enseñas... no es mi estrella.»", sets: ["santa_secret"], gives: ["ev_cuaderno"] },
      ] },
      { id: "key", q: "¿Retiraste la llave de reserva?", needs: ["ev:ev_llaves"], a: [
        { t: "«Me la llevé el 20 de diciembre. Quería revisar la estrella en persona y no encontré el momento. Aquí está, en mi cajón. Nunca salió de este almacén.»", sets: ["key_santa", "key_missing_known"] },
      ] },
      { id: "advice", q: "¿Sospechas de alguien?", a: [
        { t: "«Sospechar es una forma de impaciencia. Busca lo que no encaja con la hora.»" },
      ] },
    ],
    present: {
      ev_engranaje: [{ t: "«Pequeña... esa no es mi estrella. La original lleva grabada una estrella de ocho puntas y brilla con la nieve. Esta es una copia de latón. El diente no está roto por un golpe: está cansado.»", sets: ["santa_secret"], gives: ["ev_cuaderno"] }],
      ev_llaves: [{ t: "«Sí, firmé yo. Esa llave sigue conmigo.»", sets: ["key_santa", "key_missing_known"] }],
      ev_prototipo: [{ t: "«La caja de Pip. La dejó a las 23:47, como dice la nota. Aquí estuvo hasta las 23:50.»", sets: ["pip_santa"], events: ["e_pip_S"] }],
      ev_cuaderno: [{ t: "«Mis notas de 1923. Aún me tiembla la mano al releerlas.»" }],
      ev_carta_cifrada: [{ when: ["flag:cipher_solved"], t: "«Una confesión a medias... Lucien estaba asustado, no malvado. Por eso no dije nada: esperaba que me lo contase él.»" }],
    },
    fallback: "«Es un hermoso misterio, pero no sé más que tú.»",
  },

  grinch: {
    intro: "Apoyado en una farola, con el abrigo lleno de óxido, el Grinch te mira con media sonrisa. «Vaya, la detective. ¿Viene a arrestarme? Qué previsible: el gruñón del pueblo.»",
    topics: [
      { id: "where", q: "¿Dónde estabas a las 23:40?", a: [
        { t: "«Paseando. Lejos de villancicos y de gente feliz. Como siempre.» " },
        { when: ["flag:grinch_room"], t: "«Está bien: en la posada, habitación 3, desde las 23:05. Berta me debe un favor, y yo a ella dos.»" },
      ] },
      { id: "clock", q: "¿Por qué odias el reloj?", a: [
        { t: "«No odio el reloj. Odio que todo el pueblo ponga su fe en una maquinaria que ya no es lo que era.»" },
      ] },
      { id: "rust", q: "¿De dónde sale ese óxido del abrigo?", a: [
        { t: "«Me apoyé en una valla.» " },
        { when: ["flag:grinch_room"], t: "«Subí al andamio de mantenimiento a las 22:50. Quería ver el mecanismo con mis propios ojos y hice esta foto desde la ventana trasera. No toqué nada. Después me escondí en la posada.»", sets: ["grinch_investigating"], gives: ["ev_foto"] },
      ] },
    ],
    present: {
      ev_huellas: [{ t: "«¿Mis botas? Llevo botas de montaña, no de cuero liso. Mire esa muesca: es de un tacón remendado, no mío.»", sets: ["grinch_prints"] }],
      ev_engranaje: [
        { t: "«Una pieza rota. Qué sorpresa.» " },
        { when: ["flag:grinch_investigating"], t: "«Una copia barata. Lo vi en la foto: ese engranaje no tiene estrella. Alguien estaba engañando a todo el pueblo.»" },
      ],
      ev_carta_anonima: [{ t: "«...La escribí yo. Si los soldaditos tienen esa pintura, hay niños que se los llevarán a la boca. Es lo único bueno que he hecho en años, no lo arruine.»", sets: ["grinch_letter"] }],
      ev_foto: [{ t: "«Mi foto, sí. Demuestra que a las 22:50 la leva estaba libre. Quien puso ese pasador vino después.»", sets: ["grinch_investigating"] }],
    },
    fallback: "«No me interesa nada de eso.»",
  },

  clara: {
    intro: "Clara sostiene un cancionero contra el pecho, todavía con la bufanda roja del coro. «No hemos parado de cantar hasta que las campanas no sonaron. Es decir, hasta que no sonaron.»",
    topics: [
      { id: "heard", q: "¿Oíste algo extraño?", a: [
        { t: "«Hacia las 23:53 oí un chasquido metálico en lo alto de la torre. Como un cerrojo grande. Lo comenté con Nora cuando trajo el paquete.»", sets: ["clara_click"], events: ["e_click"] },
      ] },
      { id: "saw", q: "¿Quién llegó a la plaza?", a: [
        { t: "«Nora con un paquete a las 23:53. Madeleine a las 23:55. Y Lucien a las 23:58, sin aliento y con las manos temblando. El vigilante llegó a las 23:59.»", sets: ["clara_saw"], events: ["e_nora_P", "e_lucien_P"] },
      ] },
      { id: "before", q: "¿Viste a alguien cerca de la torre antes de medianoche?", a: [
        { t: "«A eso de las 22:55 vi al Grinch bajar de un andamio junto a la torre, con el abrigo lleno de óxido. Se fue hacia la posada con cara de pocos amigos.»", sets: ["grinch_seen"] },
      ] },
      { id: "eloy", q: "¿Estuvo Eloy con vosotros?", a: [
        { t: "«Desde poco antes de las 23:45, colocando la estrella en el árbol. No se movió hasta bien pasada la medianoche.»", events: ["e_eloy_P"] },
      ] },
      { id: "bell", q: "¿Recuerdas los cuartos de las 23:45?", a: [
        { t: "«Sonaron perfectos a las 23:45, por el reloj de la torre. Después ya no hubo más campanas.»", events: ["e_bell_ref"] },
      ] },
    ],
    present: {},
    fallback: "«No lo sé, yo sólo canto y escucho.»",
  },
};
