import songData as song 
import music21 as music

def a():
    PATH = './s.mid'
    MIDI = song.get_midi(PATH)

    timeSignatures = song.get_timeSignature(MIDI)
    timeSignature = timeSignatures[0]
    print(timeSignature)
    notes = song.getNotes(MIDI, timeSignatures)
    Scale = song.get_scale(MIDI)
    a = list(x.name for x in music.scale.MinorScale(Scale[0]).getPitches())
    a.append('rest')
    ola = [x for x in notes if x.name in a]


    s1 = music.stream.Stream()
    for n in ola:
        s1.append(n)

    fp = s1.write('midi', fp='./2.mid')

def b():
    path = './c.mid'
    MIDI = song.get_midi(path)
    timeSignatures = song.get_timeSignature(MIDI)
    timeSignature = timeSignatures[0]
    print(timeSignature)
    notes = song.getit(MIDI, timeSignatures)

    midi_out = notes.write('midi', fp='./out.mid')
b()