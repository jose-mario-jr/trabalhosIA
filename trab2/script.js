function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

var myArray = ["1", "2", "3", "4", "5"]
console.log(shuffle(myArray))

//gera populacao inicial
function populacaoInicial(individuos = 10, genes = 42) {
  var pop = []
  for (i = 0; i < individuos; i++) {
    var cromossomo = {
      genes: []
    }
    // popula cada cromossomo com 42 genes de 0 a 4
    for (j = 0; j < genes; j++) {
      cromossomo.genes.push(Math.floor(Math.random() * 5))
    }
    pop.push(cromossomo)
  }
  return pop
}

// faz a funcão de aptidao que calcula a aptidao de certo individuo
function aptidao(cromossomo) {
  //aplicar regras de aptidao aqui!!

  return 0
}

function operadorCruzamento(casal, probCruzamento, doisPontos = false) {
  var filhos = [{ genes: [] }, { genes: [] }]

  var cruzaOuNao = Math.random()
  if (cruzaOuNao < probCruzamento) {
    var ponto1 = Math.round(Math.random() * casal[0].genes.length)
    var ponto2 = casal[0].genes.length
    if (doisPontos) {
      var ponto2 = Math.round(Math.random() * casal[0].genes.length)
      while (ponto1 == ponto2)
        ponto2 = Math.round(Math.random() * casal[0].genes.length)

      if (ponto1 > ponto2) {
        let aux = ponto2
        ponto2 = ponto1
        ponto1 = aux
      }
    }

    // console.log("Ocorreu Cruzamento, corte = " + ponto1)
    for (var index = 0; index < ponto1; index++) {
      filhos[1].genes.push(casal[1].genes[index])
      filhos[0].genes.push(casal[0].genes[index])
    }
    for (var index = ponto1; index < ponto2; index++) {
      filhos[1].genes.push(casal[0].genes[index])
      filhos[0].genes.push(casal[1].genes[index])
    }
    if (doisPontos) {
      for (var index = ponto2; index < casal[0].genes.length; index++) {
        filhos[1].genes.push(casal[1].genes[index])
        filhos[0].genes.push(casal[0].genes[index])
      }
    }
    // console.log("casal: ", casal)
    // console.log("filhos: ", filhos)
    return filhos
  } else {
    return casal
  }
}

function operadorMutacao(popOld, probMutacao) {
  let mutado = popOld
  for (let i = 0; i < mutado.length; i++) {
    for (let j = 0; j < mutado[i].genes.length; j++) {
      let mutaOuNao = Math.random()
      if (mutaOuNao < probMutacao) {
        mutado[i].genes[j] = Math.round(Math.random())
      }
    }
  }
  return mutado
}

function roleta(popOld, probCruzamento, probMutacao, doisPontos, elite) {
  var sumFit = 0
  var acumulatorProb = 0
  var arrayRoleta = []
  var selected = []
  var tamanhoRetorno = popOld.length - elite.length
  for (let c = 0; c < tamanhoRetorno; c++) {
    sumFit += popOld[c].aptidao
  }

  for (let c = 0; c < tamanhoRetorno; c++) {
    popOld[c].probNow = popOld[c].aptidao / sumFit
    acumulatorProb = popOld[c].probNow + acumulatorProb
    arrayRoleta.push(acumulatorProb)
  }
  for (let i = 0; i < tamanhoRetorno; i++) {
    let rand = Math.random()
    let pos = 0
    while (arrayRoleta[pos] <= rand) {
      pos++
    }

    selected.push(popOld[pos])
  }

  let filhos = []
  while (filhos.length < tamanhoRetorno) {
    let sorteados = [
      Math.floor(Math.random() * selected.length),
      Math.floor(Math.random() * selected.length)
    ]
    while (sorteados[0] == sorteados[1])
      sorteados[1] = Math.floor(Math.random() * selected.length)

    let casal = [selected[sorteados[0]], selected[sorteados[1]]]

    var tam = filhos.push(
      ...operadorCruzamento(casal, probCruzamento, doisPontos)
    )

    while (tam > tamanhoRetorno) {
      filhos.pop()
      tam--
    }
  }

  let mutado = operadorMutacao(filhos, probMutacao)

  mutado.push(...elite)
  return mutado
}

function melhorCasal(individuos, lista) {
  // observe que utilizo os itens da lista, e nao o array de populacao inteiro!
  var maior, segundoMaior
  if (individuos[lista[0]].aptidao > individuos[lista[1]].aptidao) {
    maior = individuos[lista[0]]
    segundoMaior = individuos[lista[1]]
  } else {
    maior = individuos[lista[1]]
    segundoMaior = individuos[lista[0]]
  }

  for (let i = 2; i < lista.length; i++) {
    if (individuos[lista[i]].aptidao > maior.aptidao) {
      segundoMaior = maior
      maior = individuos[lista[i]]
    } else if (individuos[lista[i]] > segundoMaior.aptidao) {
      // isso é no caso de o primeiro for o maior
      segundoMaior = individuos[lista[i]]
    }
  }
  return [maior, segundoMaior]
}

function torneio(popOld, tamanhoTorneio, probCruzamento, doisPontos, elite) {
  var filhos = []
  var tamanhoRetorno = popOld.length - elite.length

  do {
    // sorteia x valores na pop
    var sorteados = []
    for (let i = 0; i < tamanhoTorneio; i++) {
      var sorteio = Math.round(Math.random() * (popOld.length - 1))
      while (sorteados.includes(sorteio))
        sorteio = Math.round(Math.random() * (popOld.length - 1))
      sorteados.push(sorteio)
    }
    //selecionar casal
    var casal = melhorCasal(popOld, sorteados)

    tam = filhos.push(...operadorCruzamento(casal, probCruzamento, doisPontos))
    while (tam > tamanhoRetorno) {
      filhos.pop()
      tam--
    }
  } while (filhos.length < tamanhoRetorno)

  let mutado = operadorMutacao(filhos, probMutacao)

  mutado.push(...elite)
  return mutado
}

function elitismo(popOld, tamanhoElitismo) {
  var retorno = []
  var escolhidos = []

  for (let i = 0; i < tamanhoElitismo; i++) {
    var maior = popOld[0]
    var indiceMaior = 0
    for (let j = 0; j < popOld.length; j++) {
      if (popOld[j].aptidao > maior.aptidao && !escolhidos.includes(j)) {
        maior = popOld[j]
        indiceMaior = j
      }
    }
    escolhidos.push(indiceMaior)
    retorno.push(maior)
  }
  return retorno
}

function botaoClicado() {
  const tamanhoC = 42
  const tamanhoPop = parseInt(document.getElementById("tamanhoPop").value)
  const probCruzamento =
    parseInt(document.getElementById("probCruzamento").value) / 100
  const doisPontos = document.getElementById("doisPontos").checked
  const probMutacao =
    parseInt(document.getElementById("probMutacao").value) / 100
  const qtGeracoes = parseInt(document.getElementById("qtGeracoes").value)
  const tipo = document.getElementById("tipo").value
  const tamanhoTorneio = parseInt(
    document.getElementById("tamanhoTorneio").value
  )
  const tamanhoElitismo = parseInt(
    document.getElementById("tamanhoElitismo").value
  )

  // validacoes
  if (tamanhoTorneio > tamanhoPop) {
    alert("torneio muito grande!")
    document.getElementById("tamanhoTorneio").value = 2
    return
  }
  if (tamanhoElitismo > tamanhoPop) {
    alert("O elitismo não pode ser maior que a população!")
    document.getElementById("tamanhoElitismo").value = 1
    return
  }

  var population = populacaoInicial(tamanhoPop, tamanhoC)

  atualizaTabela(population[0])

  // calcula aptidao
  for (let k = 0; k < population.length; k++) {
    var apt = aptidao(population[k])
    population[k].aptidao = parseFloat(apt.valor.toFixed(2))
    population[k].x1 = parseFloat(apt.x1)
    population[k].x2 = parseFloat(apt.x2)
  }
  var add = `Geracao 0, individuos: `
  for (k = 0; k < population.length; k++) {
    add += `
        <span title="${population[k].genes}">
          ${population[k].aptidao};   
        </span>  `
  }
  add += `<br />`

  maiorGlobal = 38.85
  var melhorIndividuo = elitismo(population, 1)[0]
  melhorIndividuo.geracaoEncontrado = 0
  melhorIndividuo.erro = melhorIndividuo.aptidao / maiorGlobal

  for (let cont = 1; cont < qtGeracoes; cont++) {
    var best = []

    // elitismo nesta parte!
    var elite = elitismo(population, tamanhoElitismo)
    var melhorAgora = elitismo(population, 1)[0]

    if (melhorAgora.aptidao > melhorIndividuo.aptidao) {
      melhorIndividuo = melhorAgora
      melhorIndividuo.geracaoEncontrado = cont
      melhorIndividuo.erro = melhorIndividuo.aptidao / maiorGlobal
    }
    if (tipo == 1) {
      // seleciona melhores por roleta
      best = roleta(population, probCruzamento, probMutacao, doisPontos, elite)
    }
    if (tipo == 2) {
      // faz torneio
      best = torneio(
        population,
        tamanhoTorneio,
        probCruzamento,
        doisPontos,
        elite
      )
    }
    population = best

    // calcula aptidao
    for (let k = 0; k < population.length; k++) {
      var apt = aptidao(population[k])
      population[k].aptidao = parseFloat(apt.valor.toFixed(2))
      population[k].x1 = parseFloat(apt.x1)
      population[k].x2 = parseFloat(apt.x2)
    }

    /*const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < 1000);*/

    // poe na view
    add += `Geracao ${cont}, individuos: `
    for (k = 0; k < population.length; k++) {
      add += `
          <span title="${population[k].genes}">
            ${population[k].aptidao};   
          </span>  `
    }
    add += `<br />`
  }

  add += `populacao resultante: <br />`
  for (k = 0; k < population.length; k++) {
    add += `${population[k].genes} -> ${population[k].aptidao} <br/>`
  }
  document.getElementById("log").innerHTML = add

  alert(`Aptidao: ${melhorIndividuo.aptidao}, 
    x1 = ${melhorIndividuo.x1}, 
    x2 = ${melhorIndividuo.x2}, 
    erro = ${(melhorIndividuo.erro * 100).toFixed(2)}%,
    geração encontrada = ${melhorIndividuo.geracaoEncontrado}`)
}

function atualizaTabela(individuo) {
  trTurno1 = document.getElementById("trTurno1")
  trTurno2 = document.getElementById("trTurno2")
  trTurno3 = document.getElementById("trTurno3")

  // tira todo o texto das colunas
  trTurno1.innerHTML = ""
  trTurno2.innerHTML = ""
  trTurno3.innerHTML = ""

  // coloca cabecalho
  trTurno1.insertCell(-1).innerText = "Turno 1 (6h – 14h)"
  trTurno2.insertCell(-1).innerText = "Turno 2 (14h – 22h)"
  trTurno3.insertCell(-1).innerText = "Turno 3 (22h – 6h)"
  for (let b = 0; b < 7; b++) {
    document.getElementById("trTurno1").insertCell(-1).innerText = `${
      individuo.genes[6 * b]
    } e ${individuo.genes[6 * b + 1]}`
    document.getElementById("trTurno2").insertCell(-1).innerText = `${
      individuo.genes[6 * b + 2]
    } e ${individuo.genes[6 * b + 3]}`
    document.getElementById("trTurno3").insertCell(-1).innerText = `${
      individuo.genes[6 * b + 4]
    } e ${individuo.genes[6 * b + 5]}`
  }
}
