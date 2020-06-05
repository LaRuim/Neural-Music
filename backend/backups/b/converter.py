import os
import subprocess
import signal
import sys

def MIDI_to_mp3(filename):
    try:
        subprocess.run('timidity ./converted/{}.mid -Ow -o ./converted/{}.wav'.format(filename, filename), shell=True)
        subprocess.run('lame --preset insane ./converted/{}.wav'.format(filename), shell=True)
        subprocess.run('rm ./converted/{}.wav && rm ./converted/{}.mid'.format(filename, filename), shell=True)
        subprocess.run('cp ./converted{}.mp3 ../frontend/public/generatedMusic/{}.mp3', shell=True)
        subprocess.run('clear', shell=True)
        return True
    except:
        return False