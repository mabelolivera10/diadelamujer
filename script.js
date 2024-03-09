const SVG_NS = "http://www.w3.org/2000/svg";
const SVG_XLINK = "http://www.w3.org/1999/xlink";
let rid = null;
let gon = 7;

const colors = [
  "#ba3763",
  "#d34076",
  "#dbb0cc",
  "#fddafa",
  "#fef2fe",
  "#eec0db",
  "#ca809a",
  "#e9d8e8"
];

let m = { x: 0, y: 0 };
let previous = { x: 0, y: 0 };
let scale = 1;
let bool = false;

class Flower {
  constructor(n, pos, scale, parent) {
    this.n = n;
    this.scale = scale;
    this.pos = pos;
    this.width = 40;
    this.height = 40;
    this.color = colors[~~(Math.random() * colors.length)];
    this.parent = parent;

    this.markup();
  }

  markup() {
    this.G = document.createElementNS(SVG_NS, "g");
    this.G.setAttribute("style", `--scale:${this.scale};`);
    let rot = ~~(Math.random() * 180);
    this.G.setAttributeNS(
      null,
      "transform",
      `translate(${this.pos.x},${this.pos.y}) rotate(${rot})`
    );
    this.G.setAttributeNS(null, "fill", this.color);
    let ga = document.createElementNS(SVG_NS, "g");
    ga.setAttribute("class", "a");

    for (let i = 0; i < 2; i++) {
      // left, right
      let g = document.createElementNS(SVG_NS, "g");
      for (let j = 0; j < this.n; j++) {
        let use = document.createElementNS(SVG_NS, "use");
        use.setAttributeNS(SVG_XLINK, "xlink:href", `#petal${this.n}`);
        use.setAttributeNS(null, "width", this.width);
        use.setAttributeNS(null, "height", this.height);

        g.appendChild(use);
      }
      ga.appendChild(g);
    }
    this.G.appendChild(ga);

    this.parent.appendChild(this.G);
  }
}


svg.addEventListener("mousedown", e => {
 // Comenta o elimina el siguiente bloque de código para prevenir que se borren las flores al iniciar un nuevo dibujo
  /*
  while (svg.lastChild) {
    svg.removeChild(svg.lastChild);
  }
  */
  // if bool == true I can draw
  const song = document.getElementById("song");
  song.play();
  bool = true;
});

svg.addEventListener("mouseup", e => {
  bool = false;
  previous = {};
});

svg.addEventListener("mousemove", e => {
  if (bool) {
    m = oMousePosSVG(e);
    // number of petals
    let n = 2 + ~~(Math.random() * 4);
    // set the scale
    if (previous.x) {
      let d = dist(m, previous);
      scale = d / 30;
    } else {
      scale = 1;
    }

    let flower = new Flower(n, { x: m.x, y: m.y }, scale, svg);
    setTimeout(() => {
      flower.G.setAttribute("class", `_${flower.n}`);
    }, 50);

    previous.x = m.x;
    previous.y = m.y;
  } //if bool
});

function oMousePosSVG(e) {
  var p = svg.createSVGPoint();
  p.x = e.clientX;
  p.y = e.clientY;
  var ctm = svg.getScreenCTM().inverse();
  var p = p.matrixTransform(ctm);
  return p;
}

function dist(p1, p2) {
  let dx = p2.x - p1.x;
  let dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}



function algorithmPoly(gon, R) {
  let points = [];
  for (let a = 0; a < 2 * Math.PI; a += 0.1) {
    let r =
      R *
      Math.cos(Math.PI / gon) /
      Math.cos(a % (2 * Math.PI / gon) - Math.PI / gon);

    let x = 5000 + r * Math.cos(a);
    let y = 5000 + r * Math.sin(a);
    points.push({ x: x, y: y, r: 5 });
  }
  return points;
}

let points = algorithmPoly(gon, 2500);

let frames = 0;
function Frame() {
  rid = window.requestAnimationFrame(Frame);

  if (frames >= points.length) {
    window.cancelAnimationFrame(rid);
    rid = null;
  }
  m = points[frames];
  let n = 2 + ~~(Math.random() * 4);
  scale = ~~(Math.random() * 12) + 3;

  let flower = new Flower(n, { x: m.x, y: m.y }, scale, svg);
  setTimeout(() => {
    flower.G.setAttribute("class", `_${flower.n}`);
  }, 50);

  frames++;
  rid = window.requestAnimationFrame(Frame);

  if (frames >= points.length) {
    window.cancelAnimationFrame(rid);
    rid = null;
    // Espera 2 segundos después de formar el círculo y luego limpia las flores
    setTimeout(clearFlowers, 2000); // Ajusta el tiempo de espera si es necesario
    return; // Sale de la función para evitar ejecuciones adicionales después de cancelar la animación
  }

  frames++;
}


Frame();
document.addEventListener('keydown', function(e) {
    if (e.key === "Escape") { // Verifica si la tecla presionada es Escape
        while (svg.lastChild) { // Elimina todas las flores (hijos de svg)
            svg.removeChild(svg.lastChild);
        }
        frames = 0; // Resetea el contador de frames para reiniciar la animación si se necesita
        // Si quieres que la animación se reinicie automáticamente después de borrar, descomenta la siguiente línea
        // Frame(); 
    }
});
function clearFlowers() {
    while (svg.lastChild) {
      svg.removeChild(svg.lastChild);
    }
  }
  svg.addEventListener("touchstart", function(e) {
    e.preventDefault(); // Previene el comportamiento por defecto para eventos táctiles
    const song = document.getElementById("song");
    song.play();
    bool = true;
    // Convertir las coordenadas táctiles a coordenadas del SVG
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    svg.dispatchEvent(mouseEvent);
  }, false);
  
  svg.addEventListener("touchend", function(e) {
    e.preventDefault(); // Previene el comportamiento por defecto para eventos táctiles
    const mouseEvent = new MouseEvent("mouseup", {});
    svg.dispatchEvent(mouseEvent);
  }, false);
  
  svg.addEventListener("touchmove", function(e) {
    e.preventDefault(); // Previene el comportamiento por defecto para eventos táctiles
    if (bool) {
      // Convertir las coordenadas táctiles a coordenadas del SVG
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("mousemove", {
        clientX: touch.clientX,
        clientY: touch.clientY
      });
      svg.dispatchEvent(mouseEvent);
    }
  }, false);
