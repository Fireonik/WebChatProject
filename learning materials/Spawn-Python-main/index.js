/* index.js */
/* bring in node's spawn method */
import { spawn } from 'child_process';

/* args for python, plus output result */
let fileName = 'exponents.py';
let base = 5;
let exponent = 3;

/**
 * @desc      spawn async background process
 * @param     {string} command 'python', 'node' etc.
 * @param     {Object[]} array of args
 */
const exponentProcess = spawn('py', [fileName, base, exponent]);

/**
 * @desc      get and log value returned by python
 * @listens   'data' in pipeline: stdout.on()
 * @returns   {string} data from python math
 */
const getProduct = () => {
  let resultmn = '';
  exponentProcess.stdout.on('data', (data) => {
    resultmn = data.toString();
    console.log(typeof data)
    console.log(resultmn + "21231231");
    /* or, pass value to other part of program */
    // anotherFunction(result);
    return resultmn;
  });
};

/* expected return is '125' */
getProduct();


