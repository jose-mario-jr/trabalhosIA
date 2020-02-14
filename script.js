var population

function converteReal(lista, sup = 100, inf = 0) {
  var baseDez = 0
  for (i = 0; i < lista.length; i++) {
    if (lista[i]) baseDez += 2 ** i
  }
  return inf + ((sup - inf) / (2 ** lista.length - 1)) * baseDez
}

//gera populacao inicial
function initialPopulation(individuals = 10, genes = 8) {
  for (i = 0; i < individuals; i++) {
    cromossome = {
      genes: []
    }
    for (j = 0; j < genes; j++) {
      cromossome.genes.push(Math.round(Math.random()))
    }
    population.push(cromossome)
  }
  return population
}

function roulette(){

  let sumFit = 0
  let acumulatorProb = 0
  for (let c in population) {
    sumFit += population[c].fitness
  }
  for (let c in population) {
    acumulatorProb += population[c].fitness / sumFit
    population[c].probSelec = 0
    population[c].probSelec = acumulatorProb
    console.log(c)
  }
  let selected = []
  for(let i = 0; i< population.length; i++){
    let rand = Math.random()
    let c = 0
    while (population[c].probSelec < rand) {
      c++
    }
    selected.push(population[c])
  }
  return selected
}

function fitness(cromossome) {

  let chunk1 = cromossome.genes.slice(0, cromossome.genes.length / 2)
  let chunk2 = cromossome.genes.slice(cromossome.genes.length / 2, cromossome.genes.length)

  let x1 = converteReal(chunk1, -3.1, 12.1)
  let x2 = converteReal(chunk2, 4.1, 5.8)

  return (21.5 + (x1 * Math.sin(4 * Math.PI * x1)) + (x2 * Math.sin(20 * Math.PI * x2)))
}

function botaoClicado() {

  tamanhoC = document.getElementById("tamanhoC").value
  tamanhoPop = document.getElementById("tamanhoPop").value
  probCruzamento = document.getElementById("probCruzamento").value
  probMutacao = document.getElementById("probMutacao").value
  qtGeracoes = document.getElementById("qtGeracoes").value
  tipo = document.getElementById("tipo").value

  population = []
  population = initialPopulation(tamanhoPop, tamanhoC)
  for(let cont = 0; cont < qtGeracoes; cont++){
    // calcula aptidao
    for (let k = 0; k < population.length; k++) {
      population[k].fitness = parseFloat(fitness(population[k]).toFixed(2))
    }

    // seleciona melhores por roleta
    let best = roulette()
    population = best
  }
  //document.getElementById("log").innerHTML = add

}