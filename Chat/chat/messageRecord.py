from genericpath import isdir
import os
import sys

sender = sys.argv[1]
recepient = sys.argv[2]
msFromEpoch = sys.argv[3]
message = sys.argv[4]


def make_sure_folder_exists():
    path = 'users/' + sender + '/'
    folders = [f for f in os.listdir(path) if isdir(os.path.join(path, f))]
    if not recepient in folders:
        os.mkdir('users/' + sender + '/' + recepient)


make_sure_folder_exists()

path = 'users/' + sender + '/' + recepient + '/' + msFromEpoch + ".bin"
with open(path, "wb") as f:
    f.write(message.encode())
