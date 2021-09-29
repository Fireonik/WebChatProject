
function userSearchRequest(seeked_user) {
    let request = new XMLHttpRequest();
    request.open("POST", "/api/user-search", true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            searchResult = JSON.parse(request.responseText)
            if (!searchResult.includes('User does not exist')) {
                addChat(seeked_user)
                setChatHTML(seeked_user, 'saying something important', 'now', false)
                added_chats[seeked_user].addEventListener('click', () => {
                    if (selectedChat !== 0) {
                        setChatHTML(selectedChat, 'not active anymore', 'now', false)
                    }
                    setChatHTML(seeked_user, 'asdasdasd', 'now', true)
                    selectedChat = seeked_user

                    setCurrChatHTML(selectedChat, true)
                })
            }
        }
    }
    request.send(JSON.stringify({
        seeked_user: seeked_user
    }));
}
function setCurrChatHTML(username, online = false) {
    const infoPanel = document.querySelector('.leftSide')
    // VSC has a problem with name "status"
    status_ = (online === true) ? 'Online' : 'Offline'
    infoPanel.innerHTML = `          
    <p class="chatName">${username}</p>
    <p class="chatStatus">${status_}</p>
`

}
function addChat(username) {
    const newChat = document.createElement("div");
    const chatPanel = document.querySelector('.chats')
    added_chats[username] = newChat
    chatPanel.appendChild(newChat)
}
function setChatHTML(username, message, date, active) {
    chat = added_chats[username]
    shortenedMessage = ''
    activeStatus = (active === true) ? "active" : ''
    if (message.length > 15) {
        for (let i = 0; i < 15; i++) {
            shortenedMessage += message[i]
        }
        shortenedMessage += "..."
    } else shortenedMessage = message

    chat.innerHTML = `<div class="chatButton ${activeStatus}">
    <div class="chatInfo">
      <p class="name"> ${username} </p>
      <p class="message"> ${shortenedMessage} </p>
    </div>
  
    <div class="status normal">
      <p class="date">${date}</p>
  
    </div>
  </div>`
}
function addMessage(text, date, type = "sent") {
    const newMessage = document.createElement("div");
    const messageHistoryPanel = document.querySelector('.convHistory')
    messageType = (type === "sent") ? 'messageSent' : 'messageReceived'
    messageHistoryPanel.appendChild(newMessage)
    newMessage.innerHTML = `
    <div class="msg ${messageType}">
    ${text}
    <span class="timestamp">${date}</span>
    </div>`
}

function formatMessage(message) {
    const maxLen = 58
    result = ''
    if (message.length <= maxLen) return message

    strings = ((message.length - message.length % maxLen) / maxLen)

    for (let i = 0; i < strings * maxLen; i += maxLen) {
        for (let j = i; j < i + maxLen; j++) {
            result += message[j]
        }
        result += '\n'
    }
    if (message.length % maxLen !== 0) {
        for (let i = strings * maxLen; i < message.length; i++) {
            result += message[i]
        }
    }
    return result
}

function formattedDate(d = new Date) {
    return [d.getHours(), d.getMinutes()]
        .map(n => n < 10 ? `0${n}` : `${n}`).join(':')
        + '  '
        + [d.getDate(), d.getMonth() + 1, d.getFullYear()]
            .map(n => n < 10 ? `0${n}` : `${n}`).join('/');
}

const socket = io()
socket.on('wrongToken', () => {
    window.location.href = "/login"
})
socket.on('message', ({ sender, msFromEpoch, message }) => {
    console.log(sender)
    console.log(msFromEpoch)
    console.log(message)
})
socket.emit('online', { token: token })




const userSearchField = document.querySelector(`input[type="search"]`)
const replyField = document.querySelector(`input[type="text"]`)
const added_chats = {}
let selectedChat = 0

userSearchField.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return
    console.log(userSearchField.value)
    userSearchRequest(userSearchField.value)
    ////////////////////////////////////////////
})

replyField.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' || selectedChat === 0) return

    const date = formattedDate()
    const msFromEpoch = Date.now()
    const messageHistory = document.querySelector(".convHistory")

    message = formatMessage(replyField.value)
    addMessage(message, date)
    replyField.value = ''
    messageHistory.scrollTo(0, messageHistory.scrollHeight);

    socket.emit("messageSent", { message: message, recepient: selectedChat, msFromEpoch: msFromEpoch })
})

