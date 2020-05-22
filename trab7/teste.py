import os
import numpy as np

ampdigitos = 50
vsai = 10
neur = 200
limiar = 0.0

# ler saidas da rede.
os.chdir('saidas')
vanterior = np.loadtxt('vanterior.txt', delimiter=',')
v0anterior = np.loadtxt('v0anterior.txt', delimiter=',')
wanterior = np.loadtxt('wanterior.txt', delimiter=',')
w0anterior = np.loadtxt('w0anterior.txt', delimiter=',')

os.chdir('../digitostreinamento')
# np.shape(vanterior)
# exit()
t = np.loadtxt('target.csv', delimiter=',', skiprows=0)

aminicial = 51
amtestedigitos = 20
yteste = np.zeros((vsai, 1))
amostras = ampdigitos*vsai
cont = 0
k2 = '_'
k4 = '.txt'
contcerto = 0
zin = np.zeros((1, neur))
target = np.zeros((vsai, 1))
ordem = np.zeros(amostras)
for m in range(vsai):
  k1 = str(m)
  for n in range(amtestedigitos):
    k3a = n+aminicial
    k3 = str(k3a)
    nome = k1+k2+k3+k4
    xteste = np.loadtxt(nome)
    for m2 in range(vsai):
      for n2 in range(neur):
        # np.dot(xteste, vanterior[:, n2])
        # v0anterior[0][n2]

        zin[0][n2] = np.dot(xteste, vanterior[:, n2])+v0anterior[n2]

      z = np.tanh(zin)
      yin = np.dot(z, wanterior) + w0anterior
      y = np.tanh(yin)
    for j in range(vsai):
      if yin[0][j] >= limiar:
        y[0][j] = 1
      else:
        y[0][j] = -1
    for j in range(vsai):
      yteste[j][0] = y[0][j]
    for j in range(vsai):
      target[j][0] = t[0][j]

    soma = np.sum(y-target)
    if soma == 0:
      contcerto = contcerto+1
    cont = cont+1
taxa = contcerto/cont
print(taxa)
