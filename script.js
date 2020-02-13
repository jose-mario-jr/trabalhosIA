function converteReal(lista, sup = 100, inf = 0) {
  baseDez = 0
  for (i = 0; i < lista.length; i++) {
    if (lista[i]) baseDez += 2 ** i
  }
  return inf + ((sup - inf) / (2 ** lista.length - 1)) * baseDez
}

//gera populacao inicial
function populacaoInicial(individuals = 10, genes = 8) {
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

add = ``
populacao = populacaoInicial()
console.log(populacao)
/*
for (i = 0; i < populacao.length; i++) {
  console.log(populacao[i])
  add += `${populacao[i]} -> <br/>`
}

document.getElementById("log").innerHTML = add
