import SongData as song 
import music21 as music
import random
from copy import deepcopy 
from converter import MIDI_to_mp3


def getNotes(chord):
    notes = []
    for note in chord:
        if isinstance(note, music.note.Note):
            notes.append(str(note.pitch))
        elif isinstance(note, music.chord.Chord):
            print('wtf is this line tho')
            notes.append('.'.join(str(n) for n in note.normalOrder))
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
    for i in range(timeSignature):
        sequence.append(chord[random.randint(0, len(chord)-1)])
    return sequence

def makeBackingTrack(chordData, listOfChordObjects, timeSignature):
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
            Offset+=60/BPM
        #Offset+=240/BPM
    midi_stream = music.stream.Stream(output_notes)
    midi_stream.write('midi', fp='../testSongs/backingtrack.mid')
    MIDI_to_mp3('../testSongs/backingtrack', 'backingtrack')

#PATH = song.get_PATH() 
PATH = '../testSongs/lead.mid'
MIDI = song.get_midi(PATH)
BPM = song.getBPM(MIDI)

timeSignatures = song.get_timeSignature(MIDI)
timeSignature = timeSignatures[0]
notes = song.get_notes(MIDI, timeSignatures)
keyRootNote, keyMode = song.get_scale(MIDI)
durations = song.get_duration(MIDI, timeSignatures)
measures = song.makeMeasures(notes, durations, timeSignatures)
allPossibleChordsForScale = song.get_chords(keyMode, keyRootNote)
listOfChordObjects = song.get_matching_chords_for_measures(measures, allPossibleChordsForScale)

chordsAsListsOfNotes = chordObjects_to_listsOfNotes(listOfChordObjects)
chordData = {str(listOfChordObjects[x])[21:-1]:chordsAsListsOfNotes[x] for x in range(len(chordsAsListsOfNotes))}

makeBackingTrack(chordData, listOfChordObjects, timeSignature)




