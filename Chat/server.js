const spawn = require("child_process").spawn;
const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const { addToOnline, removeFromOnline, getUsernameById } = require('./library/users.js')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// setting the static files folder
app.use(express.static(path.join(__dirname, "static")));

io.on("connection", (socket) => {
  socket.on("signUp", ({ username, password }) => {
    const signUpAttempt = spawn("py", [`static/signUp.py`, username, password]);
    signUpAttempt.stdout.on("data", (data) => {
      socket.emit("signUpResult", data.toString());
    });
  });

  socket.on("logIn", ({ username, password }) => {
    const logInAttempt = spawn("py", [`static/logIn.py`, username, password]);
    logInAttempt.stdout.on("data", (data) => {
      socket.emit("logInResult", data.toString());
      if (data.toString() === "Success") addToOnline(socket.id, username)
    });
  });

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
