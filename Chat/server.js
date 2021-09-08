const spawn = require("child_process").spawn;
const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const { addToOnline, removeFromOnline, getUsernameById } = require('./users.js')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

function login(username, password, res) {
  const logInAttempt = spawn("py", [`login/logIn.py`, username, password]);
  result = ''
  logInAttempt.stdout.on("data", (data) => {
    result = data.toString()
    res.json({
      result: result
    })
    // if (data.toString() === "Success") addToOnline(socket.id, username)
  })
}

function signup(username, password, res) {
  const signUpAttempt = spawn("py", [`signup/signUp.py`, username, password]);
  signUpAttempt.stdout.on("data", (data) => {
    result = data.toString()
    res.json({
      result: result
    })
    // if (data.toString() === "Success") addToOnline(socket.id, username)
  })
}


// setting the static files folder
app.use(express.static(path.join(__dirname, "static")));
// body parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login', 'login.html'))
})

app.get('/sign-up', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup', 'sign-up.html'))
})

app.post('/api/login', (req, res) => {
  result = login(req.body.username, req.body.password, res)
})

app.post('/api/signup', (req, res) => {
  result = signup(req.body.username, req.body.password, res)
})


io.on("connection", (socket) => {

  socket.on("messageSent", ({ message, recepient, date }) => {
    console.log(message, recepient, date)
    getUsernameById(socket.id)
  })

  socket.on('disconnect', () => {
    removeFromOnline(socket.id)
  })


});
/* setting the port for our server
it is either default (3000) 
or the number specified by the environment where the server is being ran */
const PORT = 3000 || process.env.PORT;

//second argument exists for asynchronycity
/*in express, there would be app.listen, although since we are using
 socket.io there is server.listen, which is a complete analog*/
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
