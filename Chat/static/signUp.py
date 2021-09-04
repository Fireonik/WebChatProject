import sys

username = sys.argv[1]
password = sys.argv[2]

try:
    with open('static/users/' + username + ".bin", 'rb') as f:
        sys.stdout.write("User already exists")
except FileNotFoundError:
    try:
        with open('static/users/' + username + ".bin", "wb") as f:
            f.write(password.encode())
            sys.stdout.write("Success")
    except:
        sys.stdout.write("Unexpected error while attempting to sign up")    
except:
    sys.stdout.write("Unexpected error while attempting to sign up")
