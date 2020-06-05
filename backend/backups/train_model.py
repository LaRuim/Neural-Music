import glob
import pickle
import numpy
from music21 import converter, instrument, note, chord
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import Dropout
from keras.layers import LSTM
from keras.layers import Activation
from keras.layers import BatchNormalization as BatchNorm
from keras.utils import np_utils
from keras.callbacks import ModelCheckpoint

PATH = "./trainset/Pokemon"
PATH = PATH + "/*.mid"
def get_notes():
    """ Get all the notes and chords from the midi files in the ./midi_songs directory """
    notes = []
    iter = 1
    for file in glob.glob(PATH):
        midi = converter.parse(file)

        print((str(iter) + ". Parsing %s") % file)
        iter+=1
        notes_to_parse = None

        try: # file has instrument parts
            s2 = instrument.partitionByInstrument(midi)
            notes_to_parse = s2.parts[0].recurse() 
        except: # file has notes in a flat structure
            notes_to_parse = midi.flat.notes

        for element in notes_to_parse:
            if isinstance(element, note.Note):
                notes.append(str(element.pitch))
            elif isinstance(element, chord.Chord):
                notes.append('.'.join(str(n) for n in element.normalOrder))

    with open('./data/notes', 'wb') as filepath:
        pickle.dump(notes, filepath)

    return notes
  

def prepare_sequences(notes, n_vocab):
    """ Prepare the sequences used by the Neural Network """
    sequence_length = 100

    # get all pitch names
    pitchnames = sorted(set(item for item in notes))

     # create a dictionary to map pitches to integers
    note_to_int = dict((note, number) for number, note in enumerate(pitchnames))

    network_input = []
    network_output = []

    # create input sequences and the corresponding outputs
    for i in range(0, len(notes) - sequence_length, 1):
        sequence_in = notes[i:i + sequence_length]
        sequence_out = notes[i + sequence_length]
        network_input.append([note_to_int[char] for char in sequence_in])
        network_output.append(note_to_int[sequence_out])

    n_patterns = len(network_input)

    # reshape the input into a format compatible with LSTM layers
    network_input = numpy.reshape(network_input, (n_patterns, sequence_length, 1))
    # normalize input
    network_input = network_input / float(n_vocab)

    network_output = np_utils.to_categorical(network_output)

    return (network_input, network_output)

hidden_layer = 512 #512
dropout = 0.4 #0.3
dense = 256 #256

def create_network(network_input, n_vocab):
    """ create the structure of the neural network """
    model = Sequential()
    model.add(LSTM(
        hidden_layer,
        input_shape=(network_input.shape[1], network_input.shape[2]),
        recurrent_dropout=dropout,
        return_sequences=True
    ))
    model.add(LSTM(hidden_layer, return_sequences=True, recurrent_dropout=dropout,))
    model.add(LSTM(hidden_layer))
    model.add(BatchNorm())
    model.add(Dropout(dropout))
    model.add(Dense(dense))
    model.add(Activation('relu'))
    model.add(BatchNorm())
    model.add(Dropout(dropout))
    model.add(Dense(n_vocab))
    model.add(Activation('softmax'))
    model.compile(loss='categorical_crossentropy', optimizer='Adam' , metrics = ['categorical_accuracy'])

    return model

n_epochs = 512 #200
batchsize = 128  #128

def train(model, network_input, network_output):
    """ train the neural network """
    filepath = "./data/weights-improvement.hdf5"
    checkpoint = ModelCheckpoint(
        filepath,
        monitor='loss',
        verbose=0,
        save_best_only=True,
        mode='min'
    )
    callbacks_list = [checkpoint]

    model.fit(network_input, network_output, epochs=n_epochs, batch_size=batchsize, callbacks=callbacks_list)

def train_network():
    """ Train a Neural Network to generate music """
    notes = get_notes()

    # get amount of pitch names
    n_vocab = len(set(notes))

    network_input, network_output = prepare_sequences(notes, n_vocab)

    model = create_network(network_input, n_vocab)

    train(model, network_input, network_output)

train_network()

 
