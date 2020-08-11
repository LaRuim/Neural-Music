import os
import shutil
import glob
from music21 import *

mode = 'Major'
filenameList = glob.glob(f'./{mode}/all/*.mid')
for fn in filenameList:
    print(fn)
    s = converter.parse(fn)
    w = open('log1.txt', 'w+')
    for i in s.flat:
        print(i, file=w)
    w2 = open('log2.txt', 'w+')
    for i in s.recurse().notesAndRests:
        print(i, file=w2)
    k = s.analyze('key')
    print(k)
    i = interval.Interval(k.tonic, pitch.Pitch('C'))
    sNew = s.transpose(i)
    for i in sNew:
        print(i)
    input()