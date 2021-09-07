function sendMessageToServer(socket, message) {
    const recepient = document.querySelector('.chatName').textContent
    const date = new Date()
    socket.emit("messageSent", { message: message, recepient: recepient, date: date })
}

const socket = io()
const replyField = document.querySelector(`input[type="text"]`)

replyField.addEventListener('keydown', (event) => {
    if (event.key != 'Enter') return
    sendMessageToServer(socket, replyField.value)
})
