from subprocess import call

#call(["../waon/waon", "-i", WAV, "-o", MID, '-w', WINDOW, '-n', FOURIERS, '-s', RESOLUTION, '-t', MAXMIDINOTE])

def convertToMIDI(WAV, MID, WINDOW='3', FOURIERS='4096', RESOLUTION='2048', MAXMIDINOTE='75'):
    call(["../waon/waon", "-i", WAV, "-o", MID, '-w', WINDOW, '-n', FOURIERS, '-s', RESOLUTION, '-t', MAXMIDINOTE])

#convertToMIDI('./sg.wav', './sg.mid')