import pandas as pd
import os

from sklearn.preprocessing import LabelEncoder
from keras.utils import np_utils
from keras.layers import Dense
from keras.models import Sequential
from sklearn.model_selection import train_test_split

from keras.wrappers.scikit_learn import KerasClassifier
from sklearn.model_selection import cross_val_score

os.chdir("entradas")
entrada = pd.read_csv('entrada.csv', header=None)
saida = pd.read_csv('saida.csv', header=None)

labelEncoder = LabelEncoder()
saida = labelEncoder.fit_transform(saida)
saida_oneofclasses = np_utils.to_categorical(saida)


def new_rede():
  rede = Sequential()  # mlp
  rede.add(Dense(units=30, activation='tanh', input_dim=16))
  rede.add(Dense(units=30, activation='tanh'))
  rede.add(Dense(units=26, activation='softmax'))
  rede.compile(optimizer='adam', loss='categorical_crossentropy',
               metrics=['categorical_accuracy'])
  return rede


rna = KerasClassifier(build_fn=new_rede, epochs=10, batch_size=10)

taxas = cross_val_score(estimator=rna, X=entrada,
                        y=saida, cv=10, scoring='accuracy')

media = taxas.mean()
desvio = taxas.std()
