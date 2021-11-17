const express = require('express')
const path = require('path')


const app = express()

//creating a route
//when you just go to a web page - thats a get request
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'))
})





const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))