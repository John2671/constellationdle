# ✨ Constellationdle

**Aprende el cielo, una constelación a la vez.**

Juego diario para reconocer constelaciones, en la línea de Wordle. Cada día hay 4 constelaciones, las mismas para todos. Vas viendo su figura y eliges el nombre; si fallas, recibes pistas. Al terminar cada una, aparece su ficha con el mito, las estrellas principales y cuándo verla.

▶️ **Jugar:** https://john2671.github.io/constellationdle/

---

## Cómo se juega

- **4 constelaciones al día:** primero 2 del **zodiaco** (para calentar) y luego 2 de **todo el cielo**.
- Ves la figura (estrellas unidas por líneas) y eliges entre **6 alternativas**. Tienes **3 vidas** ⭐⭐⭐ por constelación.
- **1.er fallo → pista.** **2.º fallo → última pista.** Al 3.º se revela la respuesta.
- Después de cada una se abre su **ficha**: mito, estrellas principales con nombre, mejor época para verla, desde dónde se ve, sus vecinas en un mini mapa y un dato curioso. En las del zodiaco, compara además las fechas del signo astrológico con las fechas en que el Sol de verdad la cruza.
- Las que aciertas quedan en **tu atlas**. ¿Podrás completar las 88?

### Pistas

| Pista (1.er fallo) | Última pista (2.º fallo) |
|---|---|
| 🌙 **El cielo de hoy:** la Luna, el Sol o un planeta está en esa constelación, o hay una lluvia de meteoros que sale de ahí | 🦂 **Qué representa**, con emoji |
| 🧭 **Ubicación:** cielo norte o sur, con coordenadas | ✨ **Su estrella principal**, salvo que el nombre la delate |
| 📏 **Tamaño:** su puesto entre las 88 | 🔭 **Un objeto famoso** que contiene |
| 🤝 **Una vecina** con la que limita | ☀️ **Fechas en que el Sol la cruza** (solo zodiaco) |

Si "el cielo de hoy" aplica ese día, tiene prioridad. La posición de la Luna, el Sol y los planetas se calcula en el navegador.

### Compartir

```
Constellationdle #1 · 16 nov
♈ 2️⃣ ❌
🌌 1️⃣ 3️⃣
https://john2671.github.io/constellationdle/
```

Cada número es el intento en que acertaste; ❌ significa que no la adivinaste.

---

## Cómo funciona

- **Un solo archivo:** [`index.html`](index.html) con HTML, CSS y JavaScript, sin frameworks ni compilación. Se publica tal cual en GitHub Pages.
- **Mismo desafío para todos:** las constelaciones, sus alternativas y las pistas salen de un generador aleatorio con semilla (`mulberry32`) a partir de la fecha local. Dentro de cada ciclo no se repiten: las 13 del zodiaco se recorren en ~1 semana y las 75 restantes en ~5 semanas.
- **Figuras:** SVG dibujado con proyección estereográfica (norte arriba, este a la izquierda) y estrellas de fondo hasta magnitud 6.
- **¿En qué constelación está la Luna?** Efemérides de baja precisión (Sol y Luna con fórmulas simplificadas de Meeus; planetas con elementos orbitales de JPL) y los límites oficiales de la IAU.
- **Progreso:** se guarda en `localStorage`. Si recargas, sigues donde estabas.
- **Modo aleatorio:** para practicar sin esperar al día siguiente.

### Estadísticas globales

Usa [Supabase](https://supabase.com) desde el navegador, solo con la llave pública (*publishable key*):

- Las tablas tienen RLS de **solo lectura**. Las escrituras pasan por funciones `security definer` que validan cada dato (código de constelación, intentos 1–4, fecha dentro de ±1 día).
- Solo se guardan conteos anónimos: cuántas veces se jugó y se acertó cada constelación, y la distribución de resultados del día. No hay cuentas ni datos personales.
- Para montarlo en tu propio proyecto, ejecuta [`supabase.sql`](supabase.sql) en el SQL Editor y cambia `SUPABASE_URL` y `SUPABASE_KEY` en `index.html`.

---

## Estructura

```
index.html          el juego completo (datos de constelaciones incluidos)
supabase.sql        tablas y funciones para las estadísticas globales
tools/
  build-data.mjs    genera los datos y los inserta en index.html
data/
  constellations.*  figuras y límites (d3-celestial)
  stars.6.json      estrellas hasta magnitud 6 (d3-celestial)
  starnames.json    nombres de estrellas (d3-celestial)
  contenido-*.mjs   textos en español: nombre, mito, pistas, estrellas, dato curioso
  geo.generated.js  salida del script (referencia)
```

### Desarrollo

Para jugar en local basta con abrir `index.html` en el navegador.

Si cambias los textos de `data/contenido-*.mjs` o los datos de `data/`, regenera con Node 18 o superior:

```bash
node tools/build-data.mjs
```

El script calcula líneas, vecinas, áreas, centros y posiciones de las estrellas con nombre. También valida que los límites cubran todo el cielo sin superponerse y que ninguna pista contenga el nombre de la constelación. Al final inserta todo en `index.html` entre `/*GEO-START*/` y `/*GEO-END*/`.

---

## Créditos

- Figuras, límites y catálogo de estrellas: [d3-celestial](https://github.com/ofrohn/d3-celestial) de Olaf Frohn (licencia BSD de 3 cláusulas, ver [`data/LICENSE`](data/LICENSE)), basado en datos de la Unión Astronómica Internacional y el catálogo Hipparcos.
- Elementos orbitales: JPL, *Approximate Positions of the Planets*.
- Fuente: [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) (Google Fonts).
- Del mismo autor: [Flag Challenge](https://john2671.github.io/emol-flags/), el juego diario de banderas.
