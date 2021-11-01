const spawn = require("child_process").spawn;
const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const jwt = require('jsonwebtoken')
const { addToOnline, getUsernameById, removeFromOnline, getIdByUsername } = require('./users.js')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

function login(username, password, res) {
  function sendLoginResponse(result, token = '') {
    res.json({
      result: result,
      token: token
    });
  }
  console.log(username, password)
  const logInAttempt = spawn("py", [`login/logIn.py`, username, password]);
  logInAttempt.stdout.on("data", (data) => {
    result = data.toString()
    if (result === "Success") {
      jwt.sign({ username: username, password: password }, 'Asuka Langley Sohryu', { expiresIn: '24h' }, (err, token) => {
        sendLoginResponse(result, token)
      });
    } else {
      sendLoginResponse(result)
    }
    // if (data.toString() === "Success") addToOnline(socket.id, username)
  })
}

function signup(username, password, res) {
  const signUpAttempt = spawn("py", [`signup/signUp.py`, username, password]);
  signUpAttempt.stdout.on("data", (data) => {
    result = data.toString()
    console.log(result)
    res.json({
      result: result
    })
    // if (data.toString() === "Success") addToOnline(socket.id, username)
  })
}

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}

function userSearch(seeked_user, res) {
  console.log(seeked_user)
  const userSearchProcess = spawn("py", [`chat/userSearch.py`, seeked_user]);
  userSearchProcess.stdout.on('data', (data) => {
    res.json(JSON.stringify(data.toString()))
  })

  // may be needed for multiple search results 
  // const usernames = []
  // userSearchProcess.stdout.on("data", (data) => {
  //   username = data.toString()
  //   usernames.push(username)
  // })
  // userSearchProcess.on('exit', (code) => {
  //   if (code !== 0) {
  //     console.log('Problem with the user search')
  //     return
  //   }
  //   res.json(JSON.stringify(usernames))
  // })
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

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'chat', 'chat.html'))
})

app.post('/chat', verifyToken, (req, res) => {
  jwt.verify(req.token, 'Asuka Langley Sohryu', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      // res.sendFile(path.join(__dirname, 'chat', 'chat.html'))
    }
  });
});

app.post('/api/login', (req, res) => {
  login(req.body.username, req.body.password, res)
})

app.post('/api/signup', (req, res) => {
  signup(req.body.username, req.body.password, res)
})

app.post('/api/user-search', (req, res) => {
  userSearch(req.body.seeked_user, res)
})

app.post('/api/lastmessage', verifyToken, (req, res) => {
  jwt.verify(req.token, 'Asuka Langley Sohryu', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      console.log('last message request ' + ' to ' + authData.username + ' from ' + req.body.username)
      const the_process = spawn("py", [`chat/lastMessage.py`, authData.username, req.body.username]);
      the_process.stdout.on('data', (data) => {
        console.log(data.toString())
        const stringified_data = data.toString()

        let message = ''
        let time = ''
        console.log(stringified_data.length)
        let i = 0
        while (stringified_data[i] != '\r') {
          message += stringified_data[i]
          i += 1
        }
        i += 2
        for (let j = i; j < stringified_data.length; j++) {
          time += stringified_data[j]
        }

        console.log(message)
        console.log(time)

        shortenedMessage = ''
        if (message.length > 15) {
          for (let i = 0; i < 15; i++) {
            shortenedMessage += message[i]
          }
          shortenedMessage += "..."
        } else shortenedMessage = message

        res.json({
          shortenedMessage, msFromEpoch: time
        })

      })
      the_process.on('close', () => {
        // console.log(response[0])
      })
    }
  })
})

app.post('/api/dialog-list', verifyToken, (req, res) => {
  jwt.verify(req.token, 'Asuka Langley Sohryu', (err, authData) => {
    if (err) {
      console.log('error with auth')
      res.sendStatus(403);
    } else {
      console.log('dialog list request from ' + authData.username)
      const the_process = spawn("py", [`chat/dialogList.py`, authData.username]);

      // it seems, python writes into stdout everything way faster then js can read it
      // or maybe it fires 'data' event only after the whole thing is written
      // or maybe js cannot access stdout while python hasn't finished yet
      // anyway, for some reason creating list here and filling one element at a time is unnecessary
      the_process.stdout.on('data', (data) => {
        const dialog_list = (data.toString()).split('.')
        dialog_list.pop()
        res.json(JSON.stringify(dialog_list))

      })
    }
  })
})


io.on("connection", (socket) => {

  socket.on('online', ({ token }) => {
    console.log('onlinee')
    jwt.verify(token, 'Asuka Langley Sohryu', (err, authData) => {
      if (err) {
        socket.emit('wrongToken')
      } else {
        console.log('yes')
        console.log(socket.id, authData.username)
        addToOnline(socket.id, authData.username)
      }

    })
  })

  socket.on("messageSent", ({ message, recepient, msFromEpoch }) => {
    console.log(message, recepient, msFromEpoch)
    username = getUsernameById(socket.id)
    spawn("py", [`chat/messageRecord.py`, username, recepient, msFromEpoch, message]);
    id = getIdByUsername(recepient)
    if (id !== -1) socket.to(id).emit('message', { sender: username, msFromEpoch, message })
  })

  socket.on('disconnect', (reason) => {
    console.log('disconnect! reason: ' + reason)
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
