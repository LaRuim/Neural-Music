import utilsMIDI as song 
import music21 as music
import random
from copy import deepcopy 
from converter import MIDI_to_mp3
from filterMIDI import filterMIDI
import log

def getNotes(chord):
    notes = []
    for note in chord:
        if isinstance(note, music.note.Note):
            notes.append(str(note.pitch))
        '''elif isinstance(note, music.chord.Chord):
            print('wtf is this line tho')
            notes.append('.'.join(str(n) for n in note.normalOrder))'''
    return notes

def chordObjects_to_listsOfNotes(songChords):
    humanChords = []
    for chord in songChords:
        humanChords.append(getNotes(chord))
    chordsAsListsOfNotes = []
    for chord in humanChords:
        chordAsList = []
        for note in chord:
            chordAsList.append(music.note.Note(note))
        chordsAsListsOfNotes.append(chordAsList)
    return chordsAsListsOfNotes
  

def randomizeChord(chord, timeSignature):
    sequence = []
    for _ in range(timeSignature):
        try:
            sequence.append(chord[random.randint(0, len(chord)-1)])
        except:
            pass
    return sequence

def makeBackingTrack(chordData, listOfChordObjects, timeSignature, BPM, measureDurations, offset):
    backingTrackChords = []
    for chordObject in listOfChordObjects:
        backingTrackChords.append(chordData[str(chordObject)[21:-1]])
    randomizedChords = []
    for chord in backingTrackChords:
        randomizedChords.append(randomizeChord(chord, timeSignature))
    Offset = 0.0
    output_notes = []
    for chord in randomizedChords:
        for note in chord:
            outNote = deepcopy(note)
            outNote.offset = Offset
            outNote.storedInstrument = music.instrument.Piano()
            output_notes.append(outNote)
            #Offset+=60/BPM
        #Offset+=240/BPM
        #Offset+=(measureDurations[randomizedChords.index(chord)]*120)/BPM
        if offset == 0:
            offset = (measureDurations[randomizedChords.index(chord)]*120)/BPM
        Offset += offset
    midi_stream = music.stream.Stream(output_notes)
    midi_stream.write('midi', fp='../frontend/public/generatedMusic/backingtrack.mid')
    MIDI_to_mp3('../frontend/public/generatedMusic/backingtrack', 'backingtrack')

def make(BPM=120, offset=0):
    PATH = '../frontend/public/uploadSongs/lead.mid'
    MIDI = song.getMIDI(PATH)
    #BPM = 112
    timeSignatures = song.getTimeSignature(MIDI)
    timeSignature = timeSignatures[0]

    notes = song.getFlattenedNotes(MIDI)
    music.stream.Stream(notes).write('midi', fp='./converted/flattened.mid')
    keyRootNote, keyMode = song.getScale(MIDI)
    #Durations = song.get_duration(MIDI, timeSignatures)
    '''for i in range(len(Durations)):
        if Durations[i] in [0.75, 1.25]:
            Durations[i] -= 0.25'''
    
    '''with open('./log.txt', 'w+') as log:
        log.write(keyRootNote)
        log.write(keyMode)
        log.write('\n'+str(notes)+'\n')
        log.write(str(Durations)+'\n')
        log.write(str(len(notes)))
        log.write('\n'+ str(len(Durations)))
        log.write('\n'+str(BPM))'''

    for note in notes:
        note.quarterLength = (round(note.quarterLength * 8))/8 # To make each note nice and even; We might need to remove this

    Measures = music.stream.Stream(notes).makeMeasures().makeTies()
    measures = []
    measureDurations = []
    for measure in Measures:
        myNotes = []
        for note in measure:
            try:
                myNotes.append(note.name)
            except:
                pass
        measures.append(myNotes)
        measureDurations.append(measure.duration.quarterLength)
    Measures.write('midi', fp='./smooth.mid') # For debugging

    allPossibleChordsForScale = song.getChords(keyMode, keyRootNote)
    listOfChordObjects = song.getBestChordsForMeasures(measures, allPossibleChordsForScale)

    chordsAsListsOfNotes = chordObjects_to_listsOfNotes(listOfChordObjects)
    chordData = {str(listOfChordObjects[x])[21:-1]:chordsAsListsOfNotes[x] for x in range(len(chordsAsListsOfNotes))}
    makeBackingTrack(chordData, listOfChordObjects, timeSignature, BPM, measureDurations, offset)

#make()

'''def beta(BPM=130):
    PATH = '../../frontend/public/uploadSongs/lead.mid'
    MIDI = song.getMIDI(PATH)
    #BPM = 112
    timeSignatures = song.getTimeSignature(MIDI)
    timeSignature = timeSignatures[0]

    notes = song.getFlattenedNotes(MIDI)
    for note in notes:
        note.quarterLength = (round(note.quarterLength * 8))/8
    Measures = music.stream.Stream(notes).makeMeasures().makeTies()
    measures = []
    for measure in Measures:
        measures.append(list(measure))
        print(measure.duration.quarterLength)
    Measures.write('midi', fp='./smooth.mid')'''
