from genericpath import isdir
import os
import sys

user = sys.argv[1]


path = 'users/' + user + '/'
folders = [f for f in os.listdir(path) if isdir(os.path.join(path, f))]

for user in folders:
    sys.stdout.write(user + '.')
