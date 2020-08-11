import music21 as music
from collections import defaultdict
import log
import random

def getMIDI(PATH):
    return music.converter.parse(PATH)

def zerofyChordVolume(MIDI):
    for part in MIDI.recurse().parts:
        print(part)

zerofyChordVolume(getMIDI('../testSongs/ksg.mid'))