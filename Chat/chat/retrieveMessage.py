import sys

path = sys.argv[1]

with open(path, 'rb') as file:
    result = ((file.readline()).decode())
    sys.stdout.write(result)
