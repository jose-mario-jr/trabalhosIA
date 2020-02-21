function converteReal(lista, sup = 100, inf = 0) {
  var baseDez = 0
  for (i = 0; i < lista.length; i++) {
    if (lista[i]) baseDez += 2 ** i
  }
  return inf + ((sup - inf) / (2 ** lista.length - 1)) * baseDez
}

//gera populacao inicial
function populacaoInicial(individuos = 10, genes = 8) {
  var pop = []
  for (i = 0; i < individuos; i++) {
    var cromossomo = {
      genes: []
    }
    for (j = 0; j < genes; j++) {
      cromossomo.genes.push(Math.round(Math.random()))
    }
    pop.push(cromossomo)
  }
  return pop
}

function aptidao(cromossomo) {
  let pedaco1 = cromossomo.genes.slice(0, cromossomo.genes.length / 2)
  let pedaco2 = cromossomo.genes.slice(
    cromossomo.genes.length / 2,
    cromossomo.genes.length
  )

  let x1 = converteReal(pedaco1, -3.1, 12.1)
  let x2 = converteReal(pedaco2, 4.1, 5.8)

  return {
    valor:
      21.5 + x1 * Math.sin(4 * Math.PI * x1) + x2 * Math.sin(20 * Math.PI * x2),
    x1: x1,
    x2: x2
  }
}

function operadorCruzamento(casal, probCruzamento, doisPontos = false) {
  var filhos = [
    { genes: [] }, 
    { genes: [] }
  ]
  
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
    if(doisPontos){
      for (var index = ponto2; index < casal[0].genes.length; index++) {
        filhos[1].genes.push(casal[1].genes[index])
        filhos[0].genes.push(casal[0].genes[index])
      }
    }  
    console.log('casal: ', casal)
    console.log('filhos: ', filhos)
    return filhos
  }
  else {
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
  while(filhos.length < tamanhoRetorno) {
    let sorteados = [
      Math.floor(Math.random() * selected.length),
      Math.floor(Math.random() * selected.length)
    ]
    while (sorteados[0] == sorteados[1])
      sorteados[1] = Math.floor(Math.random() * selected.length)

    let casal = [selected[sorteados[0]], selected[sorteados[1]]]

    var tam = filhos.push(...operadorCruzamento(casal, probCruzamento, doisPontos))
    
    while(tam>tamanhoRetorno) {
      filhos.pop()
      tam--
    }
  }

  return filhos
  // let mutado = operadorMutacao(filhos, probMutacao)
  
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
    }
    else if(individuos[lista[i]] > segundoMaior.aptidao) {
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
    while(tam>tamanhoRetorno) {
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
  const tamanhoC = parseInt(document.getElementById("tamanhoC").value)
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
  if(tamanhoElitismo>tamanhoPop) {
    alert("O elitismo não pode ser maior que a população!")
    document.getElementById("tamanhoElitismo").value = 1
    return
  }

  var population = populacaoInicial(tamanhoPop, tamanhoC)
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

  maiorGlobal = 38.76
  var melhorIndividuo = elitismo(population, 1)[0]
  melhorIndividuo.geracaoEncontrado = 0
  melhorIndividuo.erro = melhorIndividuo.aptidao / maiorGlobal

  for (let cont = 1; cont < qtGeracoes; cont++) {
    var best = []

    // elitismo nesta parte!
    var elite = elitismo(population, tamanhoElitismo)
    var melhorAgora = elitismo(population, 1)[0]

    if(melhorAgora.aptidao > melhorIndividuo.aptidao){
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
      best = torneio(population, tamanhoTorneio, probCruzamento, doisPontos, elite)
    }
    population = best

    // calcula aptidao
    for (let k = 0; k < population.length; k++) {
      var apt = aptidao(population[k])
      population[k].aptidao = parseFloat(apt.valor.toFixed(2))
      population[k].x1 = parseFloat(apt.x1)
      population[k].x2 = parseFloat(apt.x2)
    }
    
    // plota
    // plot(population)
    
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

  // plota no grafico
  dados = Plotly.newPlot("chart", [
    {
      z: getData(),
      type: "surface"
    }
  ])
  
  alert(`Aptidao: ${melhorIndividuo.aptidao}, 
    x1 = ${melhorIndividuo.x1}, 
    x2 = ${melhorIndividuo.x2}, 
    erro = ${(melhorIndividuo.erro*100).toFixed(2)}%,
    geração encontrada = ${melhorIndividuo.geracaoEncontrado}`)
}

// plota no grafico
function plot(populacao){
  novo = populacao
  novo.sort((a, b) => a.x1 - b.x1)
  console.log(populacao, novo)
  dados = Plotly.newPlot("chart", [
  {
    z: getData(),
    type: "surface"
  }])
}

function getData() {
  var arr = []
  for (let i = 0; i < 10; i++) {
    arr.push(
      Array(10)
        .fill()
        .map(() => Math.random())
    )
  }
  return arr
}

/*function getData(population) {
  var arr = {
    x: [],
    y: [],
    z: []
  }
  for (let i = 0; i < population.length; i++) {
    arr.x.push(population[i].x1)
    arr.y.push(population[i].x2)
    arr.z.push(population[i].aptidao)
  }
  return arr
}*/

//--------------------------------------------------------
