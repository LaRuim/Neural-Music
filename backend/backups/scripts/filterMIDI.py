import utilsMIDI as song 
import music21 as music

def filterMIDI(PATH, exceptionNotes=[]):
    exceptionNotes.append('rest')
    MIDI = song.get_midi(PATH)
    timeSignatures = song.get_timeSignature(MIDI)
    timeSignature = timeSignatures[0]
    notes = song.getFilteredNotes(MIDI, timeSignatures, exceptionNotes)
    fp = notes.write('midi', fp=PATH[:-4]+'filtered'+'.mid')

#filter('../testSongs/leadMELODIA.mid')