#The following code is a basic noise cancellation code which uses a Fast Fourier Transforms for noise cancelling
#The code has the following limitations:
#(1) It works only on noises of a particular range .i.e. say noises of the range 2000-12000

#(2) It cannot remove small noises .i.e. it only removes noises spread over the song
#(This is because the fft calculated on the noisy file cannot distinguish the small noise and the total music file and hence it merges with the music file and is given as output)

#(3) It doesnot remove very loud noises and if tried to it disrupts the basic music file and the audio file obtained is messed up

#(4) The noises to be removed are defined in the noises folder and only removes those noises
# (The folder will be further increased and improved later........as of now it has very limited noises)

#(5) As a future improvement plans are of adding the feature of adaptive noise cancellation or source separation 

colab_requirements = [
    "pip install tensorflow-gpu==2.0.0-beta0",
    "pip install librosa",
    "pip install noisereduce",
    "pip install soundfile",

]

import sys, subprocess

def run_subprocess_command(cmd):
    # run the command
    process = subprocess.Popen(cmd.split(), stdout=subprocess.PIPE)
    # print the output
    for line in process.stdout:
        print(line.decode().strip())

IN_COLAB = "google.colab" in sys.modules
if IN_COLAB:
    for i in colab_requirements:
        run_subprocess_command(i)
#importing the required libraries
import glob
import os
from scipy.io import wavfile
import noisereduce as nr
import soundfile as sf
import matplotlib.pyplot as plt
import numpy as np
import io
import matplotlib
#arguments which need to be passed to the function is only the path of the noisy audio file
def noiseCancel(PATH):
    data, rate = sf.read(PATH)
    rows = len(data)

    '''fig, ax = plt.subplots(figsize=(20,3)) 
    ax.plot(data)''' #I have commented out the plotting as it was unnecessary....if required uncomment it as needed
    path = './backend/data/noises'
    #The following code parses the noises folder as mentioned by the path variable
    for filename in glob.glob(os.path.join(path, '*.wav')): 
        noise_len = 2
        noise,rateofnoise = sf.read(filename)
        noise = noise.reshape(rows,2)
        noise_clip = noise[:rate*noise_len] #generates noiseclip of length 2sec for the noise cancellation 
        noise_reduced = nr.reduce_noise(audio_clip=data.flatten(), noise_clip=noise_clip.flatten(), prop_decrease=1.0, verbose=False)
        #the above function call can produce various graphs if needed by changing verbose to true
    noise_reduced = noise_reduced.reshape(-1,2)
    sf.write(PATH,noise_reduced,rate)