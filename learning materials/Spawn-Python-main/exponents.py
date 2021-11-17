# exponents.py
# access to command line arguments
import sys

# args are counted like lists or arrays
# argv[0] is the file name
base = sys.argv[1]
exponent = sys.argv[2]

# pow() raises first param to power of the second
# args are str, so convert to int
result = pow(int(base), int(exponent))
sys.stdout.write(str(result))
#print(result)

# to execute:
# python exponents.py <number> <another_number>
