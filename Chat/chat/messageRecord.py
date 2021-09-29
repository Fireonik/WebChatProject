from genericpath import isdir
import os
import sys

sender = sys.argv[1]
recepient = sys.argv[2]
msFromEpoch = sys.argv[3]
message = sys.argv[4]

path = 'users/' + sender + '/'
dir = os.path.join('users', sender, recepient)
# filtering foldernames from file and folder names in directory
folders = [f for f in os.listdir(path) if isdir(os.path.join(path, f))]
if not (recepient in folders):
    os.mkdir(dir)

with open(dir + '/' + msFromEpoch + ".bin", "wb") as f:
    f.write(message.encode())
    sys.stdout.write("Success")
