from genericpath import isdir
import os
import sys

username = sys.argv[1]
password = sys.argv[2]

path = "users/"
# filtering foldernames from file and folder names in directory
folders = [f for f in os.listdir(path) if isdir(os.path.join(path, f))]
if not (username in folders):
    sys.stdout.write('User does not exist')
    exit()
try:
    with open('users/' + username + '/password' + ".bin", "rb") as f:
        user_password = (f.readline()).decode()
        if password == user_password:
            sys.stdout.write("Success")
        else:
            sys.stdout.write("Wrong password")
except:
    sys.stdout.write("Unexpected error while attempting to sign up")
