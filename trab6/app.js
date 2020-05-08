import Dados from "./dados.js"

const x = Dados.x
const t = Dados.t

const amostras = x.length
const entradas = x[0].length
const numClasses = t.length
const targets = t[0].length
const limiar = 0

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

let v,
  yIn,
  v0 = []
document.querySelector("#botaoTreinar").onclick = () => {
  v = Array.from(new Array(entradas), () =>
    Array.from(new Array(numClasses), () => random(-0.1, 0.1))
  )
  let vAnterior = Array.from(new Array(entradas), () =>
    Array.from(new Array(numClasses), () => 0)
  )

  v0 = Array.from(new Array(numClasses), () => random(-0.1, 0.1))

  let vetor1 = []
  let vetor2 = []

  yIn = Array(numClasses).fill(0)
  let y = Array(numClasses).fill(0)

  const alfa = parseFloat(document.querySelector("#taxaAprendizagem").value)
  const tipoCriterio = parseInt(document.querySelector("#tipoCriterio").value)
  const valorCriterio = parseFloat(
    document.querySelector("#valorCriterio").value
  )
  const maximoCiclos = tipoCriterio == 1 ? valorCriterio : 1000
  const erroTolerado = tipoCriterio == 2 ? valorCriterio : 0.00001

  let log = ""
  let erro = 10
  let ciclo = 0

  while (ciclo < maximoCiclos && erro > erroTolerado) {
    ciclo++
    erro = 0
    for (let i = 0; i < amostras; i++) {
      let xAux = x[i]

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
