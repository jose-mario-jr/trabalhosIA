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

function sorteio(arrayRoleta) {
  let rand = Math.random()
  let c = 0
  while (arrayRoleta[c] <= rand) {
    c++
  }
  return c
}

function operadorCruzamento(popOld, probCruzamento) {
  let crossed = []
  for (let i = 0; i < popOld.length / 2; i++) {
    sorteados = [
      Math.floor(Math.random() * popOld.length),
      Math.floor(Math.random() * popOld.length)
    ]
    while (sorteados[0] == sorteados[1])
      sorteados[1] = Math.floor(Math.random() * popOld.length)
    casal = [popOld[sorteados[0]], popOld[sorteados[1]]]
    console.log(casal, sorteados)
    cruzaOuNao = Math.random()
    if (cruzaOuNao < probCruzamento) {
      pontoCruzamento = Math.round(Math.random() * casal[0].genes.length)
      cromossomosNovos = [{ genes: [] }, { genes: [] }]
      for (var index = 0; index < pontoCruzamento; index++) {
        cromossomosNovos[0].genes[index] = casal[0].genes[index]
        cromossomosNovos[1].genes[index] = casal[1].genes[index]
      }
      for (
        var index = pontoCruzamento;
        index < casal[0].genes.length;
        index++
      ) {
        cromossomosNovos[1].genes[index] = casal[1].genes[index]
        cromossomosNovos[0].genes[index] = casal[0].genes[index]
      }
      crossed.push(...cromossomosNovos)
    } else {
      // só passa para frente
      crossed.push(...casal)
    }
  }
  return crossed
}

function operadorMutacao(popOld, probMutacao) {
  let muted = popOld
  console.log(muted)
  for (let i = 0; i < muted.length; i++) {
    for (let j = 0; j < muted[i].genes.length; j++) {
      mutaOuNao = Math.random()
      if (mutaOuNao < probMutacao) {
        muted[i].genes[j] = Math.round(Math.random())
      }
    }
  }
  return muted
}

function roulette(popOld, probCruzamento, probMutacao) {
  var sumFit = 0
  var acumulatorProb = 0
  var arrayRoleta = []
  var selected = []

  for (let c = 0; c < popOld.length; c++) {
    sumFit += popOld[c].fitness
  }

  for (let c = 0; c < popOld.length; c++) {
    popOld[c].probNow = popOld[c].fitness / sumFit
    acumulatorProb = popOld[c].probNow + acumulatorProb
    arrayRoleta.push(acumulatorProb)
  }
  for (let i = 0; i < popOld.length; i++) {
    let pos = sorteio(arrayRoleta)

    selected.push(popOld[pos])
  }

  let crossed = operadorCruzamento(selected, probCruzamento)
  let muted = operadorMutacao(crossed, probMutacao)
  return muted
}

function botaoClicado() {
  const tamanhoC = document.getElementById("tamanhoC").value
  const tamanhoPop = document.getElementById("tamanhoPop").value
  const probCruzamento = document.getElementById("probCruzamento").value
  const probMutacao = document.getElementById("probMutacao").value
  const qtGeracoes = document.getElementById("qtGeracoes").value
  const tipo = document.getElementById("tipo").value
  console.log(probCruzamento, probMutacao)

  var population = initialPopulation(tamanhoPop, tamanhoC)
  // calcula aptidao
  for (let k = 0; k < population.length; k++) {
    population[k].fitness = parseFloat(fitness(population[k]).toFixed(2))
  }
  var add = ""

  if (tipo == 1) {
    // roleta
    for (let cont = 0; cont < qtGeracoes; cont++) {
      // seleciona melhores por roleta
      var best = roulette(population, probCruzamento, probMutacao)
      population = best

      // calcula aptidao
      for (let k = 0; k < population.length; k++) {
        population[k].fitness = parseFloat(fitness(population[k]).toFixed(2))
      }

      add += `Geracao ${cont}, individuos: `
      for (k = 0; k < population.length; k++) {
        add += `
          <span title="${population[k].genes}">
            ${population[k].fitness};   
          </span>  `
      }
      add += `<br />`
    }
  }
  add += `populacao resultante: <br />`
  for (k = 0; k < population.length; k++) {
    add += `${population[k].genes} -> ${population[k].fitness} <br/>`
  }
  document.getElementById("log").innerHTML = add
}

//--------------------------------------------------------
