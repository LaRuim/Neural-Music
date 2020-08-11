import music21 as music
import os
import shutil
import glob

mode = 'Major'
folderList = []
FolderList = glob.glob(f'./{mode}/*')


def move(mode, fileName, folder):
    print(fileName, folder)
    shutil.copy(fileName, folder)
    print(f'Copied to {folder}')

for folder in FolderList:
    for midi in glob.glob(f'{folder}/*.mid'):
        try:
            move(mode, midi, f'./{mode}/all/{midi.split("/")[-1]}')
        except:
            pass
