from genericpath import isdir, isfile
import os
import sys

sender = sys.argv[2]
recepient = sys.argv[1]


def make_sure_folder_exists():
    path = 'users/' + sender + '/'
    folders = [f for f in os.listdir(path) if isdir(os.path.join(path, f))]
    if not recepient in folders:
        os.mkdir('users/' + sender + '/' + recepient)


make_sure_folder_exists()

path = 'users/' + sender + '/' + recepient + '/'
files = [f for f in os.listdir(path) if isfile(os.path.join(path, f))]
for i in range(len(files)):
    files[i] = files[i][:-4]
the_latest = max(files)

with open(path + the_latest + '.bin', 'rb') as f:
    result = ((f.readline()).decode())
    sys.stdout.write(result + '\n')
sys.stdout.write(the_latest)
