from pydub import AudioSegment
sound = AudioSegment.from_mp3("./sg.mp3")
sound.export("./sg.wav", format="wav")