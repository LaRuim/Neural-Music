import glob
import pickle
import numpy
from music21 import converter, instrument, note, chord
from keras.models import Sequential
from keras.layers import Dense, Dropout, LSTM, Activation
from keras.layers import BatchNormalization as BatchNorm
from keras.utils import np_utils
from keras.callbacks import ModelCheckpoint
import argparse
import utilsMIDI as song
import log

majors = dict([('A-', 4),('G#', 4),('A', 3),('A#', 2),('B-', 2),('B', 1),('C', 0),('C#', -1),('D-', -1),('D', -2),('D#', -3),('E-', -3),('E', -4),('F', -5),('F#', 6),('G-', 6),('G', 5)])
minors = dict([('G#', 1), ('A-', 1),('A', 0),('A#', -1),('B-', -1),('B', -2),('C', -3),('C#', -4),('D-', -4),('D', -5),('D#', 6),('E-', 6),('E', 5),('F', 4),('F#', 3),('G-', 3),('G', 2)])

def getAllNotes(fileNames):
    """ Get all the notes and chords from the MIDI files in the ./midi_songs directory """
    notes = []
    songID = 1
    for fileName in glob.glob(fileNames):

        MIDI = song.getMIDI(fileName)
        print((str(songID) + ". Parsing %s") % fileName)
        songID+=1
        musicElements = None

        try: # fileName has instrument parts
            s2 = instrument.partitionByInstrument(MIDI)
            musicElements = s2.parts[0].recurse() 
        except: # fileName has notes in a flat structure
            musicElements = MIDI.flat.notes

        name, mode = song.getScale(MIDI)
        if mode == "major":
            halfSteps = majors[name]
        
        elif mode == "minor":
            halfSteps = minors[name]

        for element in musicElements:
            if isinstance(element, note.Note):
                transposedNote = str(element.transpose(halfSteps).pitch)
                notes.append(transposedNote)
            elif isinstance(element, chord.Chord):
                transposedChord = element.transpose(halfSteps)
                notes.append('.'.join(str(n) for n in element.normalOrder))
            else:
                log.error(f'{element} is an anomaly.')

    with open(f'../data/notes/{fileNames.split("/")[-3]}/notes', 'wb+') as filepath:
        pickle.dump(notes, filepath)

    return notes
  

def prepareSequences(notes, n_vocab, sequenceLength = 100):
    """ Prepare the sequences used by the Neural Network """

    # get all pitch names
    pitchNames = sorted(set(item for item in notes))

     # create a dictionary to map pitches to integers
    integerRepresentation = dict((note, number) for number, note in enumerate(pitchNames))

    networkInput = []
    networkOutput = []

    # create input sequences and the corresponding outputs
    for i in range(0, len(notes) - sequenceLength, 1):
        inputSequence = notes[i:i + sequenceLength]
        outputSequence = notes[i + sequenceLength]
        networkInput.append([integerRepresentation[note] for note in inputSequence])
        networkOutput.append(integerRepresentation[outputSequence])

    n_patterns = len(networkInput)

    # reshape the input into a format compatible with LSTM layers
    networkInput = numpy.reshape(networkInput, (n_patterns, sequenceLength, 1))
    # normalize input
    networkInput = networkInput / float(n_vocab)

    networkOutput = np_utils.to_categorical(networkOutput)

    return (networkInput, networkOutput)

hidden_layer = 512 #512
dropout = 0.4 #0.3
dense = 256 #256

def create_network(networkInput, n_vocab):
    """ create the structure of the neural network """
    model = Sequential()
    model.add(LSTM(
        hidden_layer,
        input_shape=(networkInput.shape[1], networkInput.shape[2]),
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

n_epochs = 312 #200
batchsize = 128  #128

def train(model, networkInput, networkOutput, fileNames):
    """ train the neural network """
    #change to reflect multiple weight files for different progressions; take progression name, and major/minor as input somehow (parameter or command line)
    #path should look like: ./data/weights/majororminor/whateverprogression.hdf5
    FileNames = fileNames.split('/')
    Mode, progression = FileNames[-3], FileNames[-2]
    filepath = f"../data/weights/{Mode}/{progression}.hdf5" 
    checkpoint = ModelCheckpoint(
        filepath,
        monitor='loss',
        verbose=0,
        save_best_only=True,
        mode='min'
    )
    callbacks_list = [checkpoint]

    model.fit(networkInput, networkOutput, epochs=n_epochs, batch_size=batchsize, callbacks=callbacks_list)

def train_network(filePaths):
    """ Train a Neural Network to generate music """
    notes = getAllNotes(filePaths)

    # get amount of pitch names
    n_vocab = len(set(notes))
    networkInput, networkOutput = prepareSequences(notes, n_vocab)
    model = create_network(networkInput, n_vocab)
    train(model, networkInput, networkOutput, filePaths)

#train_network()
def main(Mode):
    if Mode in ['Minor', 'minor', 'm', 'min']:
        PATH = "../training/Minor/"
    elif Mode in ['Major', 'major', 'M', 'maj']:
        PATH = "../training/Major/"
    else:
        log.error('Wrong scale type.')
        return
    folders = glob.glob(PATH + "*")
    chordProgressionsList = [folder.split('/')[-1] for folder in folders]
    for chordProgression in chordProgressionsList:
        filePaths = f'{PATH}{chordProgression}/*.mid'
        train_network(filePaths)
        
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Train Neural Network')
    parser.add_argument('-m', action='store',
                        dest='Mode', help='Mode of the scaletype being trained', type=str)
    results = parser.parse_args()
    Mode = results.Mode
    main(Mode)
