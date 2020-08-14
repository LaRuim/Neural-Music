import pickle
import numpy
from music21 import instrument, note, stream, chord, scale
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.layers import Dropout
from tensorflow.keras.layers import LSTM
from tensorflow.keras.layers import BatchNormalization as BatchNorm
from tensorflow.keras.layers import Activation
from converter import MIDI_to_mp3
import random

majors = dict([('A-', 4),('G#', 4),('A', 3),('A#', 2),('B-', 2),('B', 1),('C', 0),('C#', -1),('D-', -1),('D', -2),('D#', -3),('E-', -3),('E', -4),('F', -5),('F#', 6),('G-', 6),('G', 5)])
minors = dict([('G#', 1), ('A-', 1),('A', 0),('A#', -1),('B-', -1),('B', -2),('C', -3),('C#', -4),('D-', -4),('D', -5),('D#', 6),('E-', 6),('E', 5),('F', 4),('F#', 3),('G-', 3),('G', 2)])

def prepare_sequences(notes, pitchnames, n_vocab, sequenceLength):
    #Prepare the sequences used by the Neural Network
    # map between notes and integers and back
    note_to_int = dict((note, number) for number, note in enumerate(pitchnames))

    network_input = []
    output = []
    for i in range(0, len(notes) - sequenceLength, 1):
        sequence_in = notes[i:i + sequenceLength]
        sequence_out = notes[i + sequenceLength]
        network_input.append([note_to_int[char] for char in sequence_in])
        output.append(note_to_int[sequence_out])

    n_patterns = len(network_input)

    # reshape the input into a format compatible with LSTM layers
    normalized_input = numpy.reshape(network_input, (n_patterns, sequenceLength, 1))
    # normalize input
    normalized_input = normalized_input / float(n_vocab)

    return (network_input, normalized_input)

hidden_layer= 512 #512
dropout = 0.4  #0.3
dense =  256    #256

def create_network(network_input, n_vocab, mode, progression):
    #create the structure of the neural network
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
    model.compile(loss='categorical_crossentropy', optimizer='adam')

    # Load the weights to each node
    # mode means major/minor
    model.load_weights(f'./data/weights/{mode}/{progression}.hdf5')

    return model

def generate_notes(model, network_input, pitchnames, n_vocab, Notes, start=0):
    #Generate notes from the neural network based on a sequence of notes
    # pick a random sequence from the input as a starting point for the prediction
    if not start:
        start = numpy.random.randint(0, len(network_input)-1)
    print(start)
    int_to_note = dict((number, note) for number, note in enumerate(pitchnames))

    pattern = network_input[start]
    prediction_output = []
    # generate 500 notes
    for note_index in range(Notes):
        prediction_input = numpy.reshape(pattern, (1, len(pattern), 1))
        prediction_input = prediction_input / float(n_vocab)

        prediction = model.predict(prediction_input, verbose=0)

        index = numpy.argmax(prediction)
        result = int_to_note[index]
        prediction_output.append(result)

        pattern.append(index)
        pattern = pattern[1:len(pattern)]

    return prediction_output

def create_midi(prediction_output, Scale, fileName, BPM=120, offset=0, cycles=1, timeSignature=4):
    #convert the output from the prediction to notes and create a midi file from the notes
    Offset = 0
    output_notes = []
    if not offset:
        offset = 480/(BPM*cycles*timeSignature)
    mode = Scale.split()[-1]
    if mode == 'Major':
        key = scale.MajorScale(Scale.split()[0])
        diff = majors[key.tonic.name]
    elif mode == 'Minor':
        key = scale.MinorScale(Scale.split()[0])
        diff = minors[key.tonic.name]
    
    scaleNotes = list(set(list(note.name for note in key.getPitches())))
    # create note and chord objects based on the values generated by the model
    for pattern in prediction_output:
        # pattern is a chord
        if ('.' in pattern) or pattern.isdigit():
            notes_in_chord = pattern.split('.')
            notes = []
            for current_note in notes_in_chord:
                new_note = note.Note(int(current_note)-diff)
                if new_note.name not in scaleNotes:
                    new_note = note.Note(int(current_note)-1)
                notes.append(new_note)
            new_chord = chord.Chord(notes)
            new_chord.offset = Offset
            output_notes.append(new_chord)
        # pattern is a note
        else:
            new_note = note.Note(pattern)
            new_note = new_note.transpose(-diff)
            if new_note.name not in scaleNotes:
                new_note = new_note.transpose(-1)
            new_note.offset = Offset
            new_note.storedInstrument = instrument.Guitar()
            output_notes.append(new_note)

        seed = random.randint(1,1000000000)
        # increase offset each iteration so that notes do not stack; the modulos are arbitrary
        if seed % 32:
            Offset += offset/2
        else:
            Offset += offset
        #offset += 0.5

    midi_stream = stream.Stream(output_notes)
    midi_stream.write('midi', fp=f'./converted/{fileName}.mid')

def make(fileName, scale, Notes=500, randomSeed=0, progression='all', BPM=120, offset=0, cycles=1, sequenceLength=100):
    # Generate a piano midi file
    #load the notes used to train the model
    mode = scale.split()[-1]
    PATH_TO_NOTES = f'./data/notes/{mode}'
    with open(PATH_TO_NOTES, 'rb') as notesToLoad:
        notes = pickle.load(notesToLoad)
    
    # Get all pitch names
    pitchnames = sorted(set(item for item in notes))
    # Get all pitch names
    n_vocab = len(set(notes))

    network_input, normalized_input = prepare_sequences(notes, pitchnames, n_vocab, sequenceLength=sequenceLength)
    model = create_network(normalized_input, n_vocab, mode, progression)
    prediction_output = generate_notes(model, network_input, pitchnames, n_vocab, Notes, start=randomSeed)
    create_midi(prediction_output, fileName=fileName, Scale=scale, BPM=BPM, offset=offset, cycles=cycles)
    MIDI_to_mp3(f'./converted/{fileName}', outfileName=fileName)

#make('here', 'C Major', offset=0, progression='all', BPM=60, cycles=1)