import music21 as music
from collections import defaultdict
import log

def getMIDI(PATH):
    return music.converter.parse(PATH)

def getScale(MIDI):
    key = MIDI.analyze('key.krumhanslschmuckler')
    return (key.tonic.name, key.mode)

def getTimeSignature(MIDI):
    time_signature_list = []
    for i in MIDI.getTimeSignatures():
        time_signature_list.append(int(str(i)[-4]))
    return time_signature_list

def getDurations(MIDI):
    song = MIDI.stripTies()
    duration = []
    for beat in song.recurse():
        try:
            if(beat.isNote or beat.isRest):
                duration.append(beat.duration.quarterLength)
        except:
            continue
    return duration

def getFlattenedNotes(MIDI): # Beta, but works correctly, solving the multiple channels problem
    Notes = []
    inputMIDI = MIDI
    if inputMIDI is not None:
        for note in inputMIDI.flat:
            try:
                if type(note) != music.chord.Chord:
                    log.debug(note.name)
                    Notes.append(note)
                else:
                    log.info(f'Skipping: {note}')
            except:
                log.info(f'Anomaly: {note}')
                continue
        return Notes
        
def getFilteredNotes(MIDI, exceptionNotes, TOLERANCE=12): # Unused, and will probably remain unused
    inputMIDI = MIDI
    Scale = getScale(MIDI)
    if Scale[1] in ['Minor', 'minor']:
        scaleNotes = list(x.name for x in music.scale.MinorScale(Scale[0]).getPitches())
    elif Scale[1] in ['Major', 'major']:
        scaleNotes = list(x.name for x in music.scale.MajorScale(Scale[0]).getPitches())
    else:
        print('Unrecognized Scale.')
        return
    scaleNotes.extend(exceptionNotes)
    occurences = defaultdict(lambda: 0)
    if inputMIDI is not None:
        for musicPart in inputMIDI.recurse().parts:
            try:
                notes = musicPart.notesAndRests.stream()
                assert len(notes.elements) > 0
                for note in notes.elements:
                    if type(note) == music.chord.Chord:
                        #print(note, 'chord')
                        pass
                    elif note.name == 'rest':
                        pass
                    elif type(note) == music.note.Note:
                        if str(note.name) == str(Scale[0]):
                            occurences[note.pitch.midi] += 1 
                    else:
                        print(f'{note} is an ANOMALY')
                '''for j in iNotes.elements:
                    if type(j)!=music.chord.Chord and j.duration.quarterLength < 6:
                        if j.duration.quarterLength > 0.1:
                            if temp:
                                for i in temp:
                                    temp[0].duration.quarterLength += i.duration.quarterLength
                                #print (temp[0].quarterLength)
                                if temp[0].duration.quarterLength > 0.1:
                                    print(temp[0].name, temp[0].quarterLength)
                                    notes.append(temp[0])
                            temp = []
                            print(j.name, j.quarterLength)
                            notes.append(j)
                        elif j.duration.quarterLength <= 100 and (temp == [] or j.name in [x.name for x in temp]):
                            temp.append(j)
                        elif j.duration.quarterLength <= 0.1 and j.name not in [x.name for x in temp]:
                            if j.quarterLength == 0:
                                pass
                            if j.name == 'rest':
                                tempo = temp[0]
                                tempo.quarterLength = j.quarterLength
                                temp.append(tempo)
                            else:
                                for i in temp:
                                    temp[0].quarterLength += i.quarterLength
                                if temp[0].quarterLength > 0.06:
                                    print(temp[0].name, temp[0].quarterLength)
                                    notes.append(temp[0])
                                temp = []
                            temp.append(j)'''                
            except:
                print('except')
                for element in musicPart.elements:
                    try:
                        notes = element.notesAndRests.stream()
                    except Exception as e:
                        if type(e) == AttributeError:
                            continue
                    for note in notes:
                        if type(note) == music.chord.Chord:
                            pass
                        elif note.name == 'rest':
                            pass
                        elif type(note) == music.note.Note:
                            if str(note.name) == str(Scale[0]):
                                occurences[note.pitch.midi] += 1 
                        else:
                            print(f'{note} is an ANOMALY')

        median = max(occurences, key=occurences.get)
        MAX = median+TOLERANCE
        MIN = median-TOLERANCE
        #print(median, MAX, MIN)
        for musicPart in inputMIDI.recurse().parts:
            try:
                notes = musicPart.notesAndRests.stream()
                assert len(notes.elements) > 0
                for note in notes.elements:
                    if type(note) == music.chord.Chord:
                        #print(note, 'chord')
                        pass
                    elif note.name == 'rest':
                        pass
                    elif type(note) == music.note.Note:
                        if note.name not in scaleNotes:
                            print(f'{note} not in scale {Scale[0]} {Scale[1]}')
                            note.volume = 0
                            continue
                        if int(note.pitch.midi) < MIN or int(note.pitch.midi) > MAX:
                            print(f'{note.pitch.name} might be noise. Its midipitch: {note.pitch.midi}')
                            note.volume = 0
                    else:
                        print(f'{note} is an ANOMALY')          
            except:
                print('except')
                for element in musicPart.elements:
                    try:
                        notes = element.notesAndRests.stream()
                    except Exception as e:
                        print(type(e))
                        continue
                    for note in notes:
                        if type(note) == music.chord.Chord:
                            pass
                        elif note.name == 'rest':
                            pass
                        elif type(note) == music.note.Note: 
                            if note.name not in scaleNotes:
                                print(f'{note.name} not in scale {Scale[0]} {Scale[1]}')
                                note.volume = 0
                                continue
                            if int(note.pitch.midi) < MIN or int(note.pitch.midi) > MAX:
                                print(f'{note.pitch.name} might be noise. Its midipitch: {note.pitch.midi}')
                                note.volume = 0
                        else:
                            print(f'{note} is an ANOMALY')
    return inputMIDI



# time_signatures = get_timesig(PATH)
# notes = get_notes(PATH, time_signatures)
# key_tonic_name, key_mode = getScale(PATH)
# durations = getDurations(PATH, time_signatures)
# notes=change_notes(notes)

# notes = split_notes(notes, durations, time_signatures)

def getChords(key_mode, key_tonic_name):   
    if(key_mode=="major"):
        sc1 = music.scale.MajorScale(key_tonic_name)
    else:
        sc1 = music.scale.MinorScale(key_tonic_name)
    notelist= []
    for i in sc1.getPitches():
        notelist.append(str(i)[:-1])
    notelist = notelist[:-1]
    notelist+=notelist
    chords = [[] for _ in range(7)]
    for i in range(7):
        chords[i] = [notelist[i+x] for x in range(0, 5, 2)]
    return chords

def getChordsOnly(midi):
    chords = []
    notes_to_parse = none
    try: # file has instrument parts
        inputMIDI = music.instrument.partitionbyinstrument(midi)
        notes_to_parse = inputMIDI.parts[0].recurse() 
    except: # file has notes in a flat structure
        notes_to_parse = midi.flat.notes
    #print(notes_to_parse)
    for element in notes_to_parse:
        if (isinstance(element , music.chord.chord)):
            chords.append(element)
    return chords
# chords_list = getChords(key_mode, key_tonic_name)

def getBestChord(notes, chords_list):
    notes = set(notes)
    selectedChord = set()
    bestIntersection = 0
    for i in range(len(chords_list)):
        chords_list[i] = set(chords_list[i])
        if(len(notes.intersection(chords_list[i])) > bestIntersection):
            bestIntersection = len(notes.intersection(chords_list[i]))
            selectedChord = chords_list[i]
    if len(selectedChord) == 0:
        selectedChord = []
    return music.chord.Chord(selectedChord)

def getBestChordsForMeasures(measures, chords_list):
    chords_list_final = [[] for _ in measures]
    for i in range(len(measures)):
        chords_list_final[i] = getBestChord(measures[i], chords_list)
    return chords_list_final

def getBPM(MIDI):
    for i in range(0,20):
        token = str(MIDI.parts[0][i])
        if 'MetronomeMark' in token:
            return float(token[token.index('=')+1:].replace('>',''))

     



# chords_list_object = getBestChordsForMeasures(notes, chords_list)
