#imports
import os
import shutil
import glob
from utilsMIDI import *
import music21 as m21 

#functions
def convert(list): 
    return tuple(list)
def convert_to_list(tupleOfTuples):
    final = []
    for i in tupleOfTuples:
        temp = list(i)
        final.append(temp)
    return final

def preProcessing(file):
    midi = getMIDI(file)
    time_signatures = getTimeSignature(file)
    key_tonic_name, key_mode = getScale(file)
    durations = getDurations(file, time_signatures)
    chords_list = getChordsOnly(midi)
    return [midi, time_signatures, key_tonic_name, key_mode, durations, chords_list]

def translate(progression):
    ans = ""
    for i in progression:
        temp = list(i)
        c1 = m21.chord.Chord(temp)
        ans = ans + str(c1.root()) + c1.quality + " "
    return ans

#paths
PATH = "./"
PATH = PATH + "*.mid"

#main code
for file in glob.glob(PATH):
    print(f"Song: {file}\n", "*"*30)
    midi, time_signatures, key_tonic_name, key_mode, durations, chords_list = preProcessing(file)
    #print(chords_list)
    for i in range(len(chords_list)):
        chords_list[i] = str(chords_list[i])[21:-1]
        temp = ""
        for j in chords_list[i]:
            if (j.isdigit() == False):
                temp += j
        chords_list[i] = m21.chord.Chord(temp)

        
    if (time_signatures[0] != 4):
        continue
    new_chords_list_object = []
    chords_list_object_v2 = []
    temp = []
    map_the_chords = dict()
    for i in range(len(chords_list)):
        if (i%time_signatures[0]==0 and i > 0):
            temp = convert(temp)
            if (temp in map_the_chords.keys()):
                map_the_chords[temp]+=1
            else:
                map_the_chords[temp] = 1

            new_chords_list_object.append(temp)
            temp = []
        temp.append(convert(sorted(str(chords_list[i])[21:-1].split())))
        a = set(convert(sorted(str(chords_list[i])[21:-1].split())))
        if len(a) > 2:
            chords_list_object_v2.append(tuple(a))
    print(chords_list_object_v2)
    

    repeated_even = 0
    for i in range(0, len(chords_list_object_v2)-1, 2):
        if (chords_list_object_v2[i] == chords_list_object_v2[i+1]):
            repeated_even += 1

    useNewList = False
    map_the_chords_v2 = dict()
    print(len(chords_list_object_v2), repeated_even)
    if (len(chords_list_object_v2)*0.375 <= repeated_even):
        useNewList = True
        chords_list_object_v2 = chords_list_object_v2[::2]
        temp_v2 = list()
        new_chords_list_object_v2 = []
        for i in range(len(chords_list_object_v2)):
            if (i%time_signatures[0]==0 and i > 0):
                temp_v2 = convert(temp_v2)
                if (temp_v2 in map_the_chords_v2.keys()):
                    map_the_chords_v2[temp_v2]+=1
                else:
                    map_the_chords_v2[temp_v2] = 1
                new_chords_list_object.append(temp_v2)
                temp_v2 = list() 
            
            temp_v2.append(chords_list_object_v2[i])
            new_chords_list_object_v2.append(convert(sorted(str(chords_list_object_v2[i])[21:-1].split())))
    final = []
    if (useNewList == False):
        frequencies = list(map_the_chords.items())
        frequencies.sort(key = lambda x : x[1], reverse = True)
        final = frequencies[0]
        print('freq', final)
    else:
        frequencies = list(map_the_chords_v2.items())
        frequencies.sort(key = lambda x : x[1], reverse = True)
        final = frequencies[0]
        #print('freq', final)
    final = convert_to_list(final[0])
    x = translate(final).split()
    print(x)
    x = [y[0] for y in x]
    print(x)
    notes = 'ABCDEFGABCDEFG'
    lol = notes.index(key_tonic_name)
    notes = notes[lol:lol+8]
    folder = ""
    for i in x:
        folder =  folder + str(notes.index(i)+1)
    folderlist = [] 
    for path in os.listdir("."):
        folderlist.append(path)
    if  folder in folderlist:
        pass
        #shutil.move(file, folder)
    else:
        os.mkdir("./" + folder)
        #shutil.move(file, folder)

