from subprocess import call

#call(["../waon/waon", "-i", WAV, "-o", MID, '-w', WINDOW, '-n', FOURIERS, '-s', RESOLUTION, '-t', MAXMIDINOTE])

def convertToMIDI(WAV, MID, WINDOW='3', FOURIERS='8192', RESOLUTION='2048', MAXMIDINOTE='81'):
    call(["../waon/waon", "-i", WAV, "-o", MID, '-w', WINDOW, '-n', FOURIERS, '-s', RESOLUTION, '-t', MAXMIDINOTE])

#convertToMIDI('../testSongs/ksg.wav', '../testSongs/ksgw.mid')