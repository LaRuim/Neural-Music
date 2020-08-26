import subprocess

def split(inFile):
    command = f"spleeter separate -i {inFile} "
    command += f"-o {inFile[:-4]} -c mp3 -p spleeter:2stems --verbose"
    print(f"bash -c 'source /env/Spleeter/bin/activate && {command}")
    subprocess.run(f"bash -c 'source /env/Spleeter/bin/activate && {command}'", shell=True)