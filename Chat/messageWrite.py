from genericpath import isdir
import os
import sys

message = sys.argv[1]
recepient = sys.argv[2]
date = sys.argv[3]

path = 'users/' + sender + '/'
# filtering foldernames from file and folder names in directory
folders = [f for f in os.listdir(path) if isdir(os.path.join(path, f))]
if not (recepient in folders):
    sys.stdout.write('User does not exist')
    exit()
