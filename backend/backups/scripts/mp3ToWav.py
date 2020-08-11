from pydub import AudioSegment
import argparse

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument("infile", help="Path to input mp3 file.")
    parser.add_argument("outfile", help="Path for saving output wav file.")

    args = parser.parse_args()
    sound = AudioSegment.from_mp3(args.infile)
    sound.export(args.outfile, format="wav")