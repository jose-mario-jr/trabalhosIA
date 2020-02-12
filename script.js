

function base10(lista){
    soma = 0
    for(i=0; i< lista.length; i++){
        if(lista[i]) soma += 2**i 
    }
    return soma
}

function real(lista, sup, inf){
    return inf+((sup-inf)/(2**lista.length - 1 ))*base10(lista)
}

function populacaoInicial(){
    
}