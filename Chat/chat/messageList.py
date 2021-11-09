from genericpath import isdir, isfile
import os
import sys

sender = sys.argv[1]
recepient = sys.argv[2]

path = 'users/' + sender + '/' + recepient + '/'
files = [f for f in os.listdir(path) if isfile(os.path.join(path, f))]

for i in range(len(files)):
    sys.stdout.write(files[i][:-4] + '.')
