import sys

username = sys.argv[1]
password = sys.argv[2]

try:
    with open('static/users/' + username + ".bin", 'rb') as f:
       user_password = (f.readline()).decode()
       if password == user_password:
            sys.stdout.write("Success")
       else: 
           sys.stdout.write("Wrong password")
except FileNotFoundError:
    sys.stdout.write("User does not exist")
