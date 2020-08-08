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


def makeListsOfNotes(songChords):
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
    for _ in range(3):
        chord = chord + chord
    chord.append(music.note.Rest())
    for _ in range(timeSignature):
        try:
            sequence.append(chord[random.randint(0, len(chord)-1)])
        except:
            print('what', chord)
            pass
    return sequence


def makeBackingTrack(chordData, listOfChordObjects, timeSignature, BPM, measureDurations, offset, cycles=2, arpeggio=False, outFileName='Backing Track'):
    backingTrackChords = []
    for chordObject in listOfChordObjects:
        chordNotes = ' '.join(list(note.name for note in chordObject.notes))
        backingTrackChords.append(chordData[chordNotes])
    outputChords = []
    for chord in backingTrackChords:
        if arpeggio:
            print(randomizeChord(chord, timeSignature))
            outputChords.append(randomizeChord(chord, timeSignature))
        else:
            chordWithNoteNames = set([note.name for note in chord])
            chord = list(music.note.Note(note) for note in chordWithNoteNames)
            rootNote = music.note.Note(music.chord.Chord(chord).root().name)
            if len(chord) < 4:
                rootNote.octave = 2
                chord.append(rootNote)
            outputChords.append(chord)
    Offset = 0.0
    outputNotes = []
    for chord in outputChords:
        if not offset:
            offset = (measureDurations[outputChords.index(chord)]*120)/BPM
        for _ in range(cycles):
            for note in chord:
                outNote = deepcopy(note)
                outNote.offset = Offset
                outNote.storedInstrument = music.instrument.Piano()
                outNote.octave = 3
                outputNotes.append(outNote)
                if arpeggio:
                    Offset += offset/(cycles*timeSignature)
            if arpeggio:
                chord = randomizeChord(chord, timeSignature)
            if not arpeggio:
                Offset += offset/cycles

    music.stream.Stream(outputNotes).write('midi', fp='./converted/backingtrack.mid')
    MIDI_to_mp3('./converted/backingtrack', outFileName)


def make(leadPath, outFileName='Backing Track', BPM=120, offset=0, cycles=2, arpeggio=False):
    MIDI = song.getMIDI(leadPath)
    #BPM = 112
    timeSignatures = song.getTimeSignature(MIDI)
    timeSignature = timeSignatures[0]

    notes = song.getFlattenedNotes(MIDI)
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

    #for note in notes:
    #    note.quarterLength = (round(note.quarterLength * 8))/8 # To make each note nice and even; We might need to remove this

    Measures = music.stream.Stream(notes).makeMeasures().makeTies()
    
    measures = []
    measureDurations = []
    for measure in Measures:
        myNotes = []
        for note in measure:
            try:
                myNotes.append(note.name)
                #print(note.name, end=' ')
            except:
                pass
        #print()
        measures.append(myNotes)
        measureDurations.append(measure.duration.quarterLength)
    Measures.write('midi', fp='./smooth.mid') # For debugging

    allPossibleChordsForScale = song.getAllPossibleTriadsForScale(keyMode, keyRootNote)
    listOfChordObjects = song.getBestChordsForMeasures(measures, allPossibleChordsForScale)

    chordsAsListsOfNotes = makeListsOfNotes(listOfChordObjects)
    chordData = {str(listOfChordObjects[x])[21:-1]:chordsAsListsOfNotes[x] for x in range(len(chordsAsListsOfNotes))}
    makeBackingTrack(chordData, listOfChordObjects, timeSignature, BPM, measureDurations, offset, cycles, arpeggio, outFileName)

#make()

'''def beta(BPM=130):
    leadPath = '../../frontend/public/uploadSongs/lead.mid'
    MIDI = song.getMIDI(leadPath)
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