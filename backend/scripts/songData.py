import music21 as m21

def get_PATH():
    PATH = input()
    return PATH

# PATH=get_PATH()

def get_midi(PATH):
    return m21.converter.parse(PATH)

# midi = get_midi(PATH)

def get_scale(MIDI):
    key = MIDI.analyze('key.krumhanslschmuckler')

    return (key.tonic.name, key.mode)

def get_timeSignature(MIDI):

    time_signature_list = []
    for i in MIDI.getTimeSignatures():
        time_signature_list.append(int(str(i)[-4]))
    return time_signature_list

def get_duration(MIDI, time_signatures):
    song = MIDI.stripTies()
    duration = []
    for beat in song.recurse():
        try:
            if(beat.isNote or beat.isRest):
                duration.append(beat.duration.quarterLength)
        except:
            continue
    return duration

def get_notes(MIDI, time_signatures):
    notes=[]
    s2 = MIDI
    if s2 is not None:
        
        for i in s2.recurse().parts:
            try:
                for j in i.elements[2:]:
                    k = j.notesAndRests.stream()
                    print('NEXTTHING')
                    for l in k:
                        print(type(l))
                        if type(l)!=m21.chord.Chord and l.duration.quarterLength < 2:
                            notes.append(l)
                        print('hello')
            except:
                print('This MIDI structure is not supported by this function')
    return notes

def filterUnneededNotes(MIDI, time_signatures): # Deprecated
    notes=[]
    s2 = MIDI
    if s2 is not None:
        for i in s2.recurse().parts:
            for j in i.elements[2:]:
                k = j.notesAndRests.stream()
                #print('NEXTTHING')
                for l in k:
                    if type(l) == m21.chord.Chord:
                        #print(l, 'chord')
                        pass
                    elif l.name == 'rest':
                        pass
                        #print(l)
                        #print('rest')
                    elif type(l) == m21.note.Note:
                        #print(l.octave, l)
                        if l.octave > 6:
                            l = m21.note.Rest('rest')
                    else:
                        print(l)
        return s2

def getFilteredNotes(MIDI, time_signatures):
    notes=[]
    s2 = MIDI
    if s2 is not None:
        
        for i in s2.recurse().parts:
            try:
                print(i.elements)
                for j in i.elements[2:]:
                    k = j.notesAndRests.stream()
                    #print('NEXTTHING')
                    for l in k:
                        if type(l) == m21.chord.Chord:
                            print(l, 'chord')
                        elif l.name == 'rest':
                            print(l)
                            print('rest')
                        elif type(l) == m21.note.Note:
                            print(l.octave, l)
                            if l.octave > 6:
                                l = m21.note.Rest('rest')
                        else:
                            print(l)
                            
                        #print('hello')
            except:
                #print(i.notesAndRests)
                print('yeh nahi chahiye')
                iNotes = i.notesAndRests.stream()
                temp = []
                for j in iNotes.elements:
                    
                    if type(j)!=m21.chord.Chord and j.duration.quarterLength < 6:
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
                            temp.append(j)
    return notes



# time_signatures = get_timesig(PATH)
# notes = get_notes(PATH, time_signatures)
# key_tonic_name, key_mode = get_scale(PATH)
# durations = get_duration(PATH, time_signatures)
# notes=change_notes(notes)

def makeMeasures(notes, durations, time_signatures):
    time = time_signatures[0]
    new_notes = []
    j=0
    i=0
    print(len(notes), len(durations))
    while(i<len(notes)):
        time_idx = 0
        notes_set = []
        while(time_idx<2):
            try:
                for j in range(int(durations[i]*2)):
                    notes_set.append(notes[i])
                time_idx+=durations[i]
            except:
                break
            i+=1
        new_notes.append(notes_set)
    return new_notes

# notes = split_notes(notes, durations, time_signatures)

def get_chords(key_mode, key_tonic_name):   
    if(key_mode=="major"):
        sc1 = m21.scale.MajorScale(key_tonic_name)
    else:
        sc1 = m21.scale.MinorScale(key_tonic_name)
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
        s2 = m21.instrument.partitionbyinstrument(midi)
        notes_to_parse = s2.parts[0].recurse() 
    except: # file has notes in a flat structure
        notes_to_parse = midi.flat.notes
    #print(notes_to_parse)
    for element in notes_to_parse:
        if (isinstance(element , m21.chord.chord)):
            chords.append(element)
    return chords
# chords_list = get_chords(key_mode, key_tonic_name)

def convert_notes(notes):
    new_notes = []
    for i in notes:
        if(str(i)[-5:-1]!="rest"):
            new_notes.append(str(i)[19:-1])
        else:
            new_notes.append('')
    return new_notes

def get_matching_chord(notes, chords_list):
    notes = convert_notes(notes)
    notes = set(notes)
    chords1 = set()
    maxchords = 0
    for i in range(len(chords_list)):
        chords_list[i]=set(chords_list[i])
        if(len(notes.intersection(chords_list[i])) > maxchords):
            maxchords = len(notes.intersection(chords_list[i]))
            chords1 = chords_list[i]
    return m21.chord.Chord(chords1)

def get_matching_chords_for_measures(notes, chords_list):
    chords_list_final = [[] for _ in notes]
    for i in range(len(notes)):
        chords_list_final[i] = get_matching_chord(notes[i], chords_list)
    return chords_list_final

def getBPM(MIDI):
    for i in range(0,20):
        token = str(MIDI.parts[0][i])
        if 'MetronomeMark' in token:
            return float(token[token.index('=')+1:].replace('>',''))

     



# chords_list_object = get_matching_chords_for_measures(notes, chords_list)
