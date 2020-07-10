import pandas as pd
import os

from sklearn.preprocessing import LabelEncoder
from keras.utils import np_utils
from keras.layers import Dense
from keras.models import Sequential
from sklearn.model_selection import train_test_split

import numpy as np
import sklearn.metrics import confusion_matrix

os.chdir("entradas")
entrada = pd.read_csv('entrada.csv', header=None)
saida = pd.read_csv('saida.csv', header=None)

# print(type(entrada[10][10]))  # int64
# A 1 0 0 0 ... 0
# B 0 1 0 0 ... 0
# C 0 0 1 0 ... 0
labelEncoder = LabelEncoder()
saida = labelEncoder.fit_transform(saida)
saida_oneofclasses = np_utils.to_categorical(saida)

# print(saida) # um vetor com todas as posicoes de acordo com o valor no alfabeto
# print(saida_oneofclasses) # target one of classes (igual utilizado antes)

entradas_treinamento, entradas_teste, targets_treinamento, targets_teste = train_test_split(
    entrada, saida_oneofclasses, test_size=25)

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
