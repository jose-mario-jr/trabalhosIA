function converteReal(lista, sup = 100, inf = 0) {
  baseDez = 0
  for (i = 0; i < lista.length; i++) {
    if (lista[i]) baseDez += 2 ** i
  }
  return inf + ((sup - inf) / (2 ** lista.length - 1)) * baseDez
}

//gera populacao inicial
function initialPopulation(individuals = 10, genes = 8) {
  population = []
  for (i = 0; i < 10; i++) {
    cromossome = []
    for (j = 0; j < 8; j++) {
      cromossome.push(Math.round(Math.random()))
    }
    population.push(cromossome)
  }
  return population
}

population = initialPopulation()

function fitness(cromossome) {
  
  a = 21,5 + (x1 * Math.sin(4*Math.PI*x1)) + (x2 * Math.sin(20*Math.PI*x2))

}

add = ``

for (k = 0; k < population.length; k++) {
  add += `${converteReal(population[k]).toFixed(2)} -> ${population[k]}<br/>`
}

document.getElementById("log").innerHTML = add
