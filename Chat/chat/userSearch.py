from genericpath import isdir
import os
import sys

seeked_user = sys.argv[1]

path = "users/"
# filtering foldernames from file and folder names in directory
folders = [f for f in os.listdir(path) if isdir(os.path.join(path, f))]
if not (seeked_user in folders):
    sys.stdout.write('User does not exist')
    exit()
else:
    sys.stdout.write(seeked_user)
