import pandas as pd
import os

from sklearn.preprocessing import LabelEncoder
from keras.utils import np_utils
from keras.layers import Dense
from keras.models import Sequential
from sklearn.model_selection import train_test_split

import numpy as np
from sklearn.metrics import confusion_matrix

os.chdir('digitostreinamento')

t = pd.read_csv('target_keras.csv', header=None)

(vsai, numclasses) = np.shape(t)

ampdigitos = 50
amostras = ampdigitos*vsai
entradas = 256

x = np.zeros((amostras, entradas))
k2 = '_'
k4 = '.txt'
cont = 0
ordem = np.zeros(amostras)

print("Lendo arquivos:...")

for m in range(10):
  k1 = str(m)
  for n in range(ampdigitos):
    k3a = n+1
    k3 = str(k3a)
    nome = k1+k2+k3+k4
    entrada = np.loadtxt(nome)
    x[cont, :] = entrada[:]
    ordem[cont] = m
    cont = cont+1
ordem = ordem.astype('int')

print(np.shape(x))

entradas_treinamento, entradas_teste, targets_treinamento, targets_teste = train_test_split(
    x, t, test_size=25)

rede = Sequential()  # mlp
rede.add(Dense(units=30, activation='tanh', input_dim=16))
rede.add(Dense(units=30, activation='tanh'))
rede.add(Dense(units=26, activation='softmax'))
rede.compile(optimizer='adam', loss='categorical_crossentropy',
             metrics=['categorical_accuracy'])
rede.fit(entradas_treinamento, targets_treinamento, batch_size=10, epochs=10)

taxa = rede.evaluate(entradas_teste, targets_teste)
# print(taxa)
taxas = rede.predict(entradas_teste)
taxas = (taxas > 0.5)

targets_teste2 = [np.argmax(t) for t in targets_teste]
taxas2 = [np.argmax(t) for t in taxas]

matriz_confusao = confusion_matrix(taxas2, targets_teste2)
