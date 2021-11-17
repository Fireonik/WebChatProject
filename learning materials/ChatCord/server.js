// library import
const path = require('path')
const express = require('express') 
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users')

// app is an instance of "express"
// anyway, this is how the express module is used
const app = express()

//we need this for socket.io to work
const server = http.createServer(app)

const io = socketio(server)

// setting the static(needed for server to work) files folder
app.use(express.static(path.join(__dirname, 'public')))

const system = 'system'

// runs when client connects
io.on('connection', socket => {

    socket.on('joinRoom', ({username, room}) => {
       
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)

    // socket.emit sends to the current user, socket.broadcast.emit - to all except current, io.emit - to everyone
    socket.emit('message', formatMessage(system, 'welcome to chat'))

    socket.broadcast.to(user.room).emit('message', formatMessage(system, `${user.username} has joined the chat`))
    
    // Send users and room info
    io.to(user.room).emit('roomUsers',{room: user.room, users: getRoomUsers(user.room)})

    })
    
    

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id)

        io.to(user.room).emit('message', formatMessage(user.username, msg))
    })
// Run when client disconnects
    socket.on('disconnect', () =>{
        const user = userLeave(socket.id)
        
        if(user){
            io.to(user.room).emit("message", formatMessage(system, `${user.username} has left the chat`))
            // Send users and room info
            io.to(user.room).emit('roomUsers',{room: user.room, users: getRoomUsers(user.room)})
        }


    })

})


/* setting the port for our server
it is either default (3000) 
or the number specified by the environment where the server is being ran */
const PORT = 3000 || process.env.PORT;

//second argument exists for asynchronycity
/*in express, there would be app.listen, although since we are using
 socket.io there is server.listen, which is a complete analog*/
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))


