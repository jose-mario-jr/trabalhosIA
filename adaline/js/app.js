function random(a, b) {
  return Math.random() * (b - a) + a
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

//implementar com d3 depois!
//prettier-ignore
const x = [
  [-1,-1, 1,-1,-1,-1, 1, 1,-1,-1,-1,-1, 1,-1,-1,-1,-1, 1,-1,-1,-1,-1, 1,-1,-1,-1,-1, 1,-1,-1,-1, 1, 1, 1,-1],
  [-1, 1, 1, 1,-1, 1,-1,-1,-1, 1,-1,-1,-1,-1, 1,-1,-1,-1, 1,-1,-1,-1, 1,-1,-1,-1, 1,-1,-1,-1, 1, 1, 1, 1, 1],
  [-1, 1, 1, 1,-1, 1,-1,-1,-1, 1,-1,-1,-1,-1, 1,-1,-1, 1, 1,-1,-1,-1,-1,-1, 1, 1,-1,-1,-1, 1,-1, 1, 1, 1,-1],
  [-1,-1,-1,-1, 1,-1,-1,-1, 1, 1,-1,-1, 1,-1, 1,-1, 1,-1,-1, 1, 1, 1, 1, 1, 1,-1,-1,-1,-1, 1,-1,-1,-1,-1, 1],
  [ 1, 1, 1, 1, 1, 1,-1,-1,-1,-1, 1,-1,-1,-1,-1, 1, 1, 1, 1,-1,-1,-1,-1,-1, 1,-1,-1,-1,-1, 1, 1, 1, 1, 1,-1],
  [-1, 1, 1, 1, 1, 1,-1,-1,-1,-1, 1,-1,-1,-1,-1, 1, 1, 1, 1,-1, 1,-1,-1,-1, 1, 1,-1,-1,-1, 1,-1, 1, 1, 1,-1],
  [ 1, 1, 1, 1, 1,-1,-1,-1,-1, 1,-1,-1,-1, 1,-1,-1,-1,-1, 1,-1,-1,-1, 1,-1,-1,-1,-1, 1,-1,-1,-1, 1,-1,-1,-1],
  [-1, 1, 1, 1,-1, 1,-1,-1,-1, 1, 1,-1,-1,-1, 1,-1, 1, 1, 1,-1, 1,-1,-1,-1, 1, 1,-1,-1,-1, 1,-1, 1, 1, 1,-1],
  [-1, 1, 1, 1,-1, 1,-1,-1,-1, 1, 1,-1,-1,-1, 1,-1, 1, 1, 1, 1,-1,-1,-1,-1, 1,-1,-1,-1,-1, 1, 1, 1, 1, 1,-1],
  [-1, 1, 1, 1,-1, 1,-1,-1,-1, 1, 1,-1,-1,-1, 1, 1,-1,-1,-1, 1, 1,-1,-1,-1, 1, 1,-1,-1,-1, 1,-1, 1, 1, 1,-1],
]

const t = [
  [1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, 1, -1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, 1, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, 1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, 1, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, 1, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, 1, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, 1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, 1, -1],
  [-1, -1, -1, -1, -1, -1, -1, -1, -1, 1],
]

const amostras = x.length
const entradas = x[0].length

const numClasses = t.length
const targets = t[0].length

const limiar = 0
const alfa = 0.01
const erroTolerado = 0.1

let v = Array.from(new Array(entradas), () =>
  Array.from(new Array(numClasses), () => random(-0.1, 0.1))
)
let vAnterior = Array.from(new Array(entradas), () =>
  Array.from(new Array(numClasses), () => 0)
)

let v0 = Array.from(new Array(numClasses), () => random(-0.1, 0.1))

let vetor1 = []
let vetor2 = []

let yIn = Array(numClasses).fill(0)
let y = Array(numClasses).fill(0)

let log = ""
let erro = 10
let ciclo = 0

while (erro > erroTolerado) {
  ciclo++
  erro = 0
  for (let i = 0; i < amostras; i++) {
    xAux = x[i]

    for (let m = 0; m < numClasses; m++) {
      let soma = 0
      for (let n = 0; n < entradas; n++) {
        soma = soma + xAux[n] * v[n][m]
      }
      yIn[m] = soma + v0[m]
    }

    y = yIn.map((e) => (e >= limiar ? 1 : -1))

    for (let j = 0; j < numClasses; j++) {
      erro = erro + 0.5 * (t[j][i] - y[j]) ** 2
    }

    vAnterior = v

    for (let m = 0; m < entradas; m++) {
      for (let n = 0; n < numClasses; n++) {
        v[m][n] = vAnterior[m][n] + alfa * (t[n][i] - y[n]) * xAux[m]
      }
    }
    v0Anterior = v0
    for (let j = 0; j < numClasses; j++) {
      v0[j] = v0Anterior[j] + alfa * (t[j][i] - y[j])
    }
  }
  vetor1.push(ciclo)
  vetor2.push(erro)
  if (ciclo > 50) break
  // plot(vetor1, vetor2)
}
plot(vetor1, vetor2)

document.querySelector("#concluido").innerHTML =
  "<h1> Treinamento Concluído! </h1>"
log += "Ciclos: " + ciclo + "<br />"

log +=
  "Vetor de pesos: [" +
  v.map((e) => `<br /> &emsp; &nbsp;  [ ${e.map((e) => e.toFixed(2))}]`) +
  "<br /> ]"
log += "<br /> Bias final: " + v0.map((e) => e.toFixed(2))
document.querySelector("#log").innerHTML = log

function plot(v1, v2) {
  const tr = {
    x: v1,
    y: v2,
    mode: "lines+markers",
    type: "scatter",
    name: "Pontos temporarios",
  }
  const data = [tr]

  const layout = {
    xaxis: {
      // range: [-1.5, 1.5],
      title: {
        text: "ciclo",
      },
    },
    yaxis: {
      // range: [-1.5, 1.5],
      title: {
        text: "erro",
      },
    },
  }

  Plotly.newPlot("myDiv", data, layout)
}

function teste() {
  xTeste = x[6] // uma amostra
  for (let i = 0; i < numClasses; i++) {
    let soma = 0
    for (let j = 0; j < entradas; j++) {
      soma += xTeste[j] * v[j][i]
      yIn[i] = soma + v0[i]
    }
  }
  console.log(yIn)
  let y = yIn.map((e) => (e >= limiar ? 1 : -1))
  console.log(y)
}
