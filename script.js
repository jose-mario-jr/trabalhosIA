
function real(lista, sup, inf){
    baseDez = 0
    for(i=0; i< lista.length; i++){
        if(lista[i]) baseDez += 2**i 
    }
    return inf+((sup-inf)/(2**lista.length - 1 ))*baseDez
}

//gera populacao inicial
individuos = 10
for(i=0; i<individuos; i++)
Math.round(Math.random())