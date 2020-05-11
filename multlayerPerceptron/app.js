function getDados(path, i, callback) {
  d3.csv("digitostreinamento/" + path).then((d) => {
    let e = d.columns[0]
      .split(" ")
      .filter((e) => e != "")
      .map((d) => parseFloat(d))
    callback(e, i)
  })
}

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

const ampDigitos = 50
const vsai = 10
const amostras = ampDigitos * vsai
const entradas = 256
const neur = 200
const limiar = 0
const aleatorio = 0.2

let x = new Array(amostras).fill(new Array(entradas).fill(0))

let cont = 0
let ordem = Array(amostras).fill(0)

for (let m = 0; m < vsai; m++) {
  for (let n = 0; n < ampDigitos; n++) {
    let nome = `${m}_${n + 1}.txt`
    getDados(nome, cont, (ent, i) => {
      x[i] = ent
    })

    ordem[cont] = m
    cont++
  }
}

let vAnterior,
  v0Anterior = []

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

document.querySelector("#botaoTreinar").onclick = () => {
  vAnterior = Array.from(new Array(entradas), () =>
    Array.from(new Array(neur), () => random(-aleatorio, aleatorio))
  )
  v0Anterior = [
    Array.from(new Array(neur), () => random(-aleatorio, aleatorio)),
  ]

  wAnterior = Array.from(new Array(neur), () =>
    Array.from(new Array(vsai), () => random(-aleatorio, aleatorio))
  )

  w0Anterior = [
    Array.from(new Array(vsai), () => random(-aleatorio, aleatorio)),
  ]

  vNovo = new Array(entradas).fill(new Array(neur).fill(0))
  v0Novo = [new Array(neur).fill(0)]

  vNovo = new Array(neur).fill(new Array(vsai).fill(0))
  v0Novo = [new Array(vsai).fill(0)]

  zIn = [new Array(neur).fill(0)]
  z = [new Array(neur).fill(0)]

  deltinhak = new Array(vsai).fill([0])
  deltaw0 = new Array(vsai).fill([0])
  deltinha = [new Array(neur).fill(0)]

  xaux = [new Array(entradas).fill(0)]
  h = new Array(vsai).fill([0])
  target = new Array(vsai).fill([0])

  deltinha2 = new Array(neur).fill([0])

  yIn = Array(numClasses).fill(0)
  let y = Array(numClasses).fill(0)

  const alfa = 0.005
  const erroTolerado = 0.5

  let listaCiclo = []
  let listaErro = []

  let log = ""

  let ciclo = 0
  let erroTotal = 100000

  while (erroTolerado < erroTotal) {
    ciclo++
    erroTotal = 0
    for (let padrao = 0; padrao < amostras; padrao++) {
      for (let j = 0; j < neur; j++) {
        zIn[0][j] = sumMultList(x[padrao], vAnterior[j]) + v0Anterior[0][j]
        console.log(z[0][j])
      }

      z[0] = zIn[0].map((e) => Math.tanh(e))

      yIn = multiplyMatrices(z, wAnterior) + w0Anterior

      y = yIn[0].map((e) => Math.tanh(e))

      for (let m = 0; m < vsai; m++) {
        h[m][0] = y[0][m]
      }
      for (let m = 0; m < vsai; m++) {
        target[m][0] = t[m][ordem[padrao]]
      }

      for (let m = 0; m < vsai; m++) {
        erroTotal += 0.5 * (target[m][0] - h[m][0]) ** 2
      }

      for (let j = 0; j < numClasses; j++) {
        erro = erro + 0.5 * (t[j][i] - y[j]) ** 2
      }

      // video foi até aqui!

      vAnterior = v

      for (let m = 0; m < entradas; m++) {
        for (let n = 0; n < numClasses; n++) {
          v[m][n] = vAnterior[m][n] + alfa * (t[n][i] - y[n]) * xAux[m]
        }
      }
      let v0Anterior = v0
      for (let j = 0; j < numClasses; j++) {
        v0[j] = v0Anterior[j] + alfa * (t[j][i] - y[j])
      }
    }
    vetor1.push(ciclo)
    vetor2.push(erro)
  }
  plot(vetor1, vetor2)

  document.querySelector("#concluido").removeAttribute("hidden")
  log += "Ciclos: " + ciclo + "<br />"

  log +=
    "Vetor de pesos: [" +
    v.map((e) => `<br /> &emsp; &nbsp;  [ ${e.map((e) => e.toFixed(2))}]`) +
    "<br /> ]"
  log += "<br /> Bias final: " + v0.map((e) => e.toFixed(2))
  document.querySelector("#log").innerHTML = log

  inicializaDigitosTeste()
}

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

function getDigitoTeste() {
  let vet = []
  for (let i = 0; i < entradas; i++) {
    vet.push(document.getElementById(`digitoTeste-${i}`).checked ? 1 : -1)
  }
  return vet
}

document.querySelector("#botaoTestar").onclick = () => {
  const digitoTeste = getDigitoTeste()

  for (let i = 0; i < numClasses; i++) {
    let soma = 0
    for (let j = 0; j < entradas; j++) {
      soma += digitoTeste[j] * v[j][i]
      yIn[i] = soma + v0[i]
    }
  }
  console.log(yIn)

  let accValorPrevisto = "<h2> "
  let achou = false
  yIn.map((e, i) => {
    if (e >= limiar) {
      accValorPrevisto += `${i + 1}; `
      achou = true
    }
  })
  if (!achou) accValorPrevisto += "Irreconhecivel."

  accValorPrevisto += "</h2>"
  document.querySelector("#valorPrevisto").innerHTML = accValorPrevisto
}

function inicializaDigitosTeste() {
  let conteudoDigitosTeste = ""
  for (let i = 0; i < entradas; i++) {
    conteudoDigitosTeste += `
    <label class="chk">
      <input type="checkbox" id="digitoTeste-${i}" value="1">
      <span></span>
    </label>`
  }

  document.querySelector("#digitosTeste").innerHTML = conteudoDigitosTeste
}

document.querySelector("#botaoResetaGrid").onclick = () =>
  inicializaDigitosTeste()
