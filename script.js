function converteReal(lista, sup = 100, inf = 0) {
  var baseDez = 0
  for (i = 0; i < lista.length; i++) {
    if (lista[i]) baseDez += 2 ** i
  }
  return inf + ((sup - inf) / (2 ** lista.length - 1)) * baseDez
}

//gera populacao inicial
function initialPopulation(individuals = 10, genes = 8) {
  var pop = []
  for (i = 0; i < individuals; i++) {
    var cromossome = {
      genes: []
    }
    for (j = 0; j < genes; j++) {
      cromossome.genes.push(Math.round(Math.random()))
    }
    pop.push(cromossome)
  }
  return pop
}

function fitness(cromossome) {
  let chunk1 = cromossome.genes.slice(0, cromossome.genes.length / 2)
  let chunk2 = cromossome.genes.slice(
    cromossome.genes.length / 2,
    cromossome.genes.length
  )

  let x1 = converteReal(chunk1, -3.1, 12.1)
  let x2 = converteReal(chunk2, 4.1, 5.8)

  return (
    21.5 + x1 * Math.sin(4 * Math.PI * x1) + x2 * Math.sin(20 * Math.PI * x2)
  )
}

function roulette(popOld) {
  let sumFit = 0
  let acumulatorProb = 0
  let selected = []

  for (let c = 0; c < popOld.length; c++) {
    sumFit += popOld[c].fitness
  }
  for (let c = 0; c < popOld.length; c++) {
    popOld[c].probNow = popOld[c].fitness / sumFit
    acumulatorProb = popOld[c].probNow + acumulatorProb
    popOld[c].probSelec = acumulatorProb
  }
  console.log(popOld)
  for (let i = 0; i < popOld.length; i++) {
    let rand = Math.random()
    let c = 0
    while (popOld[c].probSelec <= rand) {
      c++
    }
    selected.push(popOld[c])
  }

  return selected
}

function botaoClicado() {
  let tamanhoC = document.getElementById("tamanhoC").value
  let tamanhoPop = document.getElementById("tamanhoPop").value
  let probCruzamento = document.getElementById("probCruzamento").value
  let probMutacao = document.getElementById("probMutacao").value
  let qtGeracoes = document.getElementById("qtGeracoes").value
  let tipo = document.getElementById("tipo").value

  var population = initialPopulation(tamanhoPop, tamanhoC)
  // calcula aptidao
  for (let k = 0; k < population.length; k++) {
    population[k].fitness = parseFloat(fitness(population[k]).toFixed(2))
  }
  for (let cont = 0; cont < qtGeracoes; cont++) {
    // seleciona melhores por roleta
    let best = roulette(population)
    console.log(best)
    population = best
  }
  //document.getElementById("log").innerHTML = add
}
