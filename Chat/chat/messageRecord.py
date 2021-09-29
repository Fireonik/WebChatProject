from genericpath import isdir
import os
import sys

sender = sys.argv[1]
recepient = sys.argv[2]
msFromEpoch = sys.argv[3]
message = sys.argv[4]


def which_combination_is_it(sender, recepient):
    conv_name1 = sender + recepient
    conv_name2 = recepient + sender
    path = 'conversations/'

    # filtering foldernames from file and folder names in directory
    folders = [f for f in os.listdir(path) if isdir(os.path.join(path, f))]
    if conv_name1 in folders:
        return conv_name1
    elif conv_name2 in folders:
        return conv_name2
    else:
        os.mkdir('conversations/' + conv_name1)
        return conv_name1


conv_name = which_combination_is_it(sender, recepient)
path = 'conversations/' + conv_name + '/' + msFromEpoch + ".bin"
with open(path, "wb") as f:
    f.write((sender + '\n').encode())
    f.write(message.encode())
