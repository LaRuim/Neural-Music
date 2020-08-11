import music21 as music
import os
import shutil
import glob

folderList = []

def find(fileName):
    KEY = input('Key: ')
    if KEY in ['no', 'NO', 'No', 'n', 'N']:
        return
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
    progression = []
    for chord in chords:
        try:
            Index = ScaleNotes.index(chord)
        except:
            Index = ScaleNotes.index(alt[chord])
        print(Index + 1, end = ' ')
        progression.append(str(Index+1))
    print()
    folder = ''.join(progression)
    if mode in ['Minor', 'minor', 'm']:
        move('Minor', fileName, folder)
    else:
        move('Major', fileName, folder)

    relative = music.key.Key(key).relative
    key, mode = relative.name.split()
    if mode in ['Minor', 'minor', 'm']:
        ScaleNotes = list(x.name for x in music.scale.MinorScale(key).getPitches())
    elif mode in ['Major', 'major', 'M', None]:
        ScaleNotes = list(x.name for x in music.scale.MajorScale(key).getPitches())
    scaleNotes = ' '.join(ScaleNotes)
    print(f'Relative Scale is: {scaleNotes}')
    print('Progression number is: ', end='')
    print()
    progression = []
    for chord in chords:
        try:
            Index = ScaleNotes.index(chord)
        except:
            Index = ScaleNotes.index(alt[chord])
        print(Index + 1, end = ' ')
        progression.append(str(Index+1))
    folder = ''.join(progression)
    if mode in ['Minor', 'minor', 'm']:
        move('Minor', fileName, folder)
    else:
        move('Major', fileName, folder)

    print()

def move(Mode, fileName, folder):
    if folder not in folderList:
        try:
            os.mkdir(f'./{Mode}/{folder}')
            print(f'Created directory {Mode}/{folder}')
        except:
            pass
        folderList.append(folder)
    shutil.copy(fileName, f'./{Mode}/{folder}/{fileName}')
    print(f'Copied to {Mode}/{folder}/{fileName}')

count = 1
fileNames = glob.glob('*.mid')
total = len(fileNames)

for fileName in glob.glob('*.mid'):
    print(f'{count}/{total}: {fileName}')
    find(fileName)
    count+=1