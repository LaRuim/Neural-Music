import os
import subprocess
import signal
import sys

def MIDI_to_mp3(infilePath, outfileName):
    try:
        subprocess.run('timidity {}.mid -Ow -o {}.wav'.format(infilePath, infilePath), shell=True)
        subprocess.run('lame --preset insane {}.wav'.format(infilePath), shell=True)
        subprocess.run('rm {}.wav && rm {}.mid'.format(infilePath, infilePath), shell=True)
        subprocess.run('cp {}.mp3 ./static/userMusic/{}.mp3'.format(infilePath, outfileName), shell=True)
        #subprocess.run('clear', shell=True)
        return True
    except:
        return False

