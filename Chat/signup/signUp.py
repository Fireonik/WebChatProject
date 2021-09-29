from genericpath import isdir
import os
import sys

username = sys.argv[1]
password = sys.argv[2]

path = "users/"
# filtering foldernames from file and folder names in directory
files = [f for f in os.listdir(path) if isdir(os.path.join(path, f))]
if (username in files):
    sys.stdout.write('User already exists')

dir = os.path.join('users', username)
os.mkdir(dir)

try:
    with open('users/' + username + '/password' + ".bin", "wb") as f:
        f.write(password.encode())
        sys.stdout.write("Success")
except:
    sys.stdout.write("Unexpected error while attempting to sign up")
