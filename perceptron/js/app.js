function random(a) {
  return Math.random() - 0.5
}

function sumMultList(m1, m2) {
  let sum = 0
  for (let i = 0; i < m1.length; i++) {
    sum += m1[i] * m2[i]
  }
  return sum
}

function multiplyMatrices(m1, m2) {
  let result = []
  for (let i = 0; i < m1.length; i++) {
    result[i] = []
    for (let j = 0; j < m2[0].length; j++) {
      let sum = 0
      for (let k = 0; k < m1[0].length; k++) {
        sum += m1[i][k] * m2[k][j]
      }
      result[i][j] = sum
    }
  }
  return result
}

const x = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
]
const t = [[1], [1], [1], [-1]]
const amostras = x.length
const entradas = x[0].length

const limiar = 0
const alfa = 0.1

// let v = Array.from(new Array(1), _ => Array(entradas).fill(0))
let v = Array(entradas).fill(0)
let vAnterior = Array(entradas).fill(0) //vanterior

let yIn = Array(amostras).fill(0) //yin
let y = Array(amostras).fill(0) //

v = v.map((v) => {
  return random()
})
let v0 = random() //v0
let v0Anterior = 0

let log = ""
let test = 1
let ciclo = 0
while (test == 1) {
  let cont = 0

  for (let i = 0; i < amostras; i++) {
    yIn[i] = sumMultList(x[i], v) + v0
    if (yIn[i] >= limiar) y[i] = 1
    else y[i] = -1
    if (y[i] == t[i]) cont++

    vAnterior = v
    for (let j = 0; j < entradas; j++) {
      v[j] = vAnterior[j] + alfa * (t[i] - y[i]) * x[i][j]
    }
    v0Anterior = v0
    v0 = v0Anterior + alfa * (t[i] - y[i])
  }
  ciclo++
  console.log("Ciclo: " + ciclo)
  console.log(cont)
  if (cont == amostras) test = 0
}

log += "Ciclos: " + ciclo + "<br />"

log += "Vetor de pesos: " + v.reduce((acc, e) => `${acc}, ${e}`) + "<br />"
log += "Bias final: " + v0
console.log(v)
console.log(v0)

let teste = multiplyMatrices(x, v)
let yfinal = Array(amostras).fill(0)
let vetor = Array(amostras).fill(1)
let yaux = teste.map((e, i) => {
  return e + v0 * vetor[i]
})

y = yaux.map((e) => {
  return e >= limiar ? 1 : -1
})

console.log(y)

let vx = Array.from(new Array(200), (e, i) => (i * 4) / 200 - 2)
let vy = Array(200).fill(0)

vy = vy.map((e, i) => -(v0 + v[0] * vx[i]) / v[1])

const trace1 = {
  x: [1, 1, -1, -1],
  y: [1, -1, 1, -1],
  mode: "markers",
  type: "scatter",
  name: "Pontos de teste",
}
const trace2 = {
  x: vx,
  y: vy,
  mode: "lines",
  type: "scatter",
  name: "Reta resultante",
}
const data = [trace1, trace2]

const layout = {
  xaxis: {
    range: [-1.5, 1.5],
  },
  yaxis: {
    range: [-1.5, 1.5],
  },
}

document.querySelector("#log").innerHTML = log
Plotly.newPlot("myDiv", data, layout)
