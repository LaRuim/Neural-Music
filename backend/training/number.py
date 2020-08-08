import music21 as music

def find():
    KEY = input('Key: ')
    if KEY[-1] == 'm':
        key = KEY[:-1]
        mode = 'm'
    else:
       key = KEY
       mode = 'M'
    key = key.upper()
    chords = input('Chords: ').upper().split()
    if mode in ['Minor', 'minor', 'm']:
        key = key.lower()
        ScaleNotes = list(x.name for x in music.scale.MinorScale(key).getPitches())
    elif mode in ['Major', 'major', 'M', '']:
        ScaleNotes = list(x.name for x in music.scale.MajorScale(key).getPitches())
    alt = {'A#':'B-', 'C#':'D-', 'D#':'E-', 'F#':'G-', 'G#':'A-', 'A-':'G#', 'G-':'F#', 'E-':'D#', 'D-':'C#', 'B-':'A#'}
    scaleNotes = ' '.join(ScaleNotes)
    print(f'Scale is: {scaleNotes}')
    print('Progression number is: ', end='')
    for chord in chords:
        try:
            Index = ScaleNotes.index(chord)
        except:
            Index = ScaleNotes.index(alt[chord])
        print(Index + 1, end = ' ')
    print()
    relative = music.key.Key(key).relative
    key, mode = relative.name.split()
    if mode in ['Minor', 'minor', 'm']:
        ScaleNotes = list(x.name for x in music.scale.MinorScale(key).getPitches())
    elif mode in ['Major', 'major', 'M', None]:
        ScaleNotes = list(x.name for x in music.scale.MajorScale(key).getPitches())
    scaleNotes = ' '.join(ScaleNotes)
    print(f'Relative Scale is: {scaleNotes}')
    print('Progression number is: ', end='')
    for chord in chords:
        try:
            Index = ScaleNotes.index(chord)
        except:
            Index = ScaleNotes.index(alt[chord])
        print(Index + 1, end = ' ')
    print()
    print()

while True: 
    find()