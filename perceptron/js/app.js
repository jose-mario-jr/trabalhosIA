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

test = 1
ciclo = 0
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

console.log(v)
console.log(v0)
