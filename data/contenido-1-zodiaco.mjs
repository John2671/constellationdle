// Contenido en español de las constelaciones del zodiaco (13, con Ofiuco).
// Campos:
//   id       abreviatura IAU en minúsculas
//   es, la   nombre en español y en latín
//   emoji    se muestra en la pista fuerte "qué representa" y en la ficha
//   rep      qué representa (pista fuerte; NO debe contener el nombre)
//   estrellas [letra Bayer o designación, nombre a mostrar] para etiquetar en la ficha
//   pista    nombre de la estrella más brillante si no delata la constelación; si no, null
//   objeto   pista fuerte "objeto famoso" (frase completa, sin el nombre) o null
//   mito     mito u origen (ficha)
//   dato     dato curioso (ficha)
//   area     área oficial IAU en grados cuadrados
//   astro    fechas del signo astrológico (solo zodiaco; null para Ofiuco)
export default [
  {
    id: "ari", es: "Aries", la: "Aries", emoji: "🐏",
    rep: "un carnero de vellón dorado",
    estrellas: [["α", "Hamal"], ["β", "Sheratan"], ["γ1", "Mesarthim"]],
    pista: "Hamal", objeto: null,
    mito: "Es el carnero alado de vellón de oro que rescató a los niños Frixo y Hele. Frixo lo sacrificó en agradecimiento y su piel, el famoso Vellocino de Oro, fue buscada después por Jasón y los argonautas.",
    dato: "Hace 2000 años el Sol estaba aquí en el equinoccio de marzo; por eso ese punto del cielo todavía se llama «punto Aries», aunque hoy cae en Piscis.",
    area: 441, astro: "21 mar – 19 abr",
  },
  {
    id: "tau", es: "Tauro", la: "Taurus", emoji: "🐂",
    rep: "un toro blanco que emerge del agua",
    estrellas: [["α", "Aldebarán"], ["β", "Elnath"], ["η", "Alcíone"]],
    pista: "Aldebarán", objeto: "Aquí están las Pléyades, el cúmulo de estrellas más famoso del cielo.",
    mito: "Zeus se transformó en un toro blanco para raptar a la princesa Europa y llevarla nadando hasta Creta. Solo se dibuja la mitad delantera del toro, como si saliera del mar.",
    dato: "Aldebarán, su ojo rojizo, parece parte del cúmulo de las Híades, pero está a menos de la mitad de su distancia.",
    area: 797, astro: "20 abr – 20 may",
  },
  {
    id: "gem", es: "Géminis", la: "Gemini", emoji: "👬",
    rep: "dos hermanos inseparables, uno mortal y otro inmortal",
    estrellas: [["α", "Cástor"], ["β", "Pólux"], ["γ", "Alhena"]],
    pista: "Pólux", objeto: null,
    mito: "Cástor y Pólux eran hermanos inseparables: Cástor era mortal y Pólux, hijo de Zeus, inmortal. Cuando Cástor murió, Pólux pidió compartir su inmortalidad con él, y Zeus los puso juntos en el cielo.",
    dato: "Cástor parece una sola estrella, pero en realidad es un sistema de seis estrellas.",
    area: 514, astro: "21 may – 20 jun",
  },
  {
    id: "cnc", es: "Cáncer", la: "Cancer", emoji: "🦀",
    rep: "un cangrejo gigante",
    estrellas: [["β", "Tarf"], ["δ", "Asellus Australis"], ["γ", "Asellus Borealis"], ["α", "Acubens"]],
    pista: "Tarf", objeto: "Aquí está el Pesebre (M44), un cúmulo de estrellas que a simple vista se ve como una manchita difusa.",
    mito: "Hera envió un cangrejo gigante a molestar a Hércules mientras luchaba contra la Hidra. Hércules lo aplastó de un pisotón, y Hera, agradecida, lo puso en el cielo.",
    dato: "Es la más tenue del zodiaco: ninguna de sus estrellas es más brillante que magnitud 3,5.",
    area: 506, astro: "21 jun – 22 jul",
  },
  {
    id: "leo", es: "Leo", la: "Leo", emoji: "🦁",
    rep: "un gran felino con melena",
    estrellas: [["α", "Régulo"], ["β", "Denébola"], ["γ1", "Algieba"]],
    pista: "Régulo", objeto: null,
    mito: "Es el león de Nemea, cuya piel no podían atravesar ni flechas ni espadas. Hércules lo venció con sus propias manos en el primero de sus doce trabajos y desde entonces usó su piel como armadura.",
    dato: "Su cabeza forma una «hoz» o un signo de interrogación al revés, uno de los dibujos más fáciles de reconocer.",
    area: 947, astro: "23 jul – 22 ago",
  },
  {
    id: "vir", es: "Virgo", la: "Virgo", emoji: "👧🌾",
    rep: "una doncella con una espiga de trigo en la mano",
    estrellas: [["α", "Espiga"], ["γ", "Porrima"], ["ε", "Vindemiatrix"]],
    pista: "Espiga (Spica)", objeto: "Aquí hay un cúmulo de más de mil galaxias, el más cercano a la nuestra.",
    mito: "Suele identificarse con Deméter, diosa de la agricultura, o con su hija Perséfone. Cada año, cuando Perséfone baja al inframundo, Deméter se entristece y llega el invierno.",
    dato: "Es la constelación más grande del zodiaco y la segunda más grande del cielo.",
    area: 1294, astro: "23 ago – 22 sep",
  },
  {
    id: "lib", es: "Libra", la: "Libra", emoji: "⚖️",
    rep: "una balanza",
    estrellas: [["α2", "Zubenelgenubi"], ["β", "Zubeneschamali"]],
    pista: "Zubeneschamali", objeto: null,
    mito: "Es la balanza de Astrea, diosa de la justicia, y la única figura del zodiaco que no es un ser vivo. Antes sus estrellas eran las pinzas del Escorpión: sus nombres árabes significan «pinza sur» y «pinza norte».",
    dato: "Hace unos 2000 años el Sol pasaba por aquí en el equinoccio de septiembre, cuando el día y la noche duran lo mismo: de ahí la idea de equilibrio.",
    area: 538, astro: "23 sep – 22 oct",
  },
  {
    id: "sco", es: "Escorpio", la: "Scorpius", emoji: "🦂",
    rep: "un animal venenoso con pinzas y aguijón",
    estrellas: [["α", "Antares"], ["λ", "Shaula"], ["θ", "Sargas"], ["δ", "Dschubba"]],
    pista: "Antares", objeto: "Aquí están los cúmulos de la Mariposa (M6) y de Ptolomeo (M7), visibles a simple vista.",
    mito: "Gea envió este animal a matar al cazador Orión, que se jactaba de poder cazar a cualquier criatura. Los pusieron en lados opuestos del cielo: cuando Escorpio sale, Orión se esconde.",
    dato: "Antares significa «rival de Marte» por su color rojo. Es tan grande que, puesta en lugar del Sol, llegaría más allá de la órbita de Marte.",
    area: 497, astro: "23 oct – 21 nov",
  },
  {
    id: "oph", es: "Ofiuco", la: "Ophiuchus", emoji: "🧑‍⚕️🐍",
    rep: "un hombre que sostiene una serpiente",
    estrellas: [["α", "Rasalhague"], ["η", "Sabik"], ["β", "Cebalrai"]],
    pista: "Rasalhague", objeto: "Aquí está la estrella de Barnard, la que se mueve más rápido en nuestro cielo.",
    mito: "Representa a Asclepio, el médico que aprendió a revivir a los muertos. Hades se quejó de perder almas y Zeus lo fulminó con un rayo, pero lo honró en el cielo. Su vara con una serpiente sigue siendo símbolo de la medicina.",
    dato: "El Sol la cruza cada año durante casi tres semanas, pero la astrología no la cuenta: por eso la llaman el «13.º signo».",
    area: 948, astro: null,
  },
  {
    id: "sgr", es: "Sagitario", la: "Sagittarius", emoji: "🏹",
    rep: "un centauro arquero",
    estrellas: [["ε", "Kaus Australis"], ["σ", "Nunki"], ["ζ", "Ascella"]],
    pista: "Kaus Australis", objeto: "En esta dirección está el centro de nuestra galaxia, con un agujero negro gigante.",
    mito: "Suele identificarse con Croto, un sátiro que inventó el arco y vivía con las musas. Otros lo ven como un centauro que apunta su flecha al corazón del Escorpión.",
    dato: "Sus estrellas más brillantes forman una «tetera»: el vapor que sale de su pico es la Vía Láctea.",
    area: 867, astro: "22 nov – 21 dic",
  },
  {
    id: "cap", es: "Capricornio", la: "Capricornus", emoji: "🐐🐟",
    rep: "un animal mitad cabra, mitad pez",
    estrellas: [["δ", "Deneb Algedi"], ["β", "Dabih"], ["α2", "Algedi"]],
    pista: "Deneb Algedi", objeto: null,
    mito: "Es el dios Pan, que huyendo del monstruo Tifón saltó a un río: la mitad que quedó bajo el agua se volvió pez y la de arriba, cabra.",
    dato: "Hace 2000 años el Sol estaba aquí en el solsticio de diciembre; por eso el paralelo 23° S se llama Trópico de Capricornio, aunque hoy en esa fecha el Sol está en Sagitario.",
    area: 414, astro: "22 dic – 19 ene",
  },
  {
    id: "aqr", es: "Acuario", la: "Aquarius", emoji: "🏺",
    rep: "un joven que vierte agua de un cántaro",
    estrellas: [["β", "Sadalsuud"], ["α", "Sadalmelik"], ["δ", "Skat"]],
    pista: "Sadalsuud", objeto: "Aquí está la nebulosa de la Hélice, apodada «el ojo de Dios».",
    mito: "Representa a Ganimedes, un joven troyano tan bello que Zeus, convertido en águila, se lo llevó al Olimpo para que sirviera la bebida a los dioses.",
    dato: "Está en una zona llamada «el Mar», llena de figuras acuáticas: Piscis, la Ballena, el Pez Austral, el Delfín y Erídano.",
    area: 980, astro: "20 ene – 18 feb",
  },
  {
    id: "psc", es: "Piscis", la: "Pisces", emoji: "🐟🐟",
    rep: "dos peces unidos por una cuerda",
    estrellas: [["η", "Alpherg"], ["α", "Alrescha"]],
    pista: "Alpherg", objeto: null,
    mito: "Afrodita y su hijo Eros escaparon del monstruo Tifón lanzándose al río Éufrates convertidos en peces. Se ataron con una cuerda para no perderse; Alrescha, «el nudo», marca dónde se unen.",
    dato: "El equinoccio de marzo está hoy en Piscis y, por la precesión, pasará a Acuario en unos 600 años: de ahí viene la «Era de Acuario».",
    area: 889, astro: "19 feb – 20 mar",
  },
];
