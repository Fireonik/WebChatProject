
function userSearchRequest(seeked_user) {
    let request = new XMLHttpRequest();
    request.open("POST", "/api/user-search", true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            searchResult = JSON.parse(request.responseText)
            const user_exists = !searchResult.includes('User does not exist')
            const chat_is_not_added_yet = added_chats[seeked_user] === undefined
            if (user_exists && chat_is_not_added_yet) {
                addChat(seeked_user)
                setChatHTML(seeked_user, '', '', false)
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
    console.log('I am invoked with username: ' + username + ' ' + username.length)
    const newChat = document.createElement("div");
    const chatPanel = document.querySelector('.chats')
    added_chats[username] = newChat
    last_messages[username] = ['', '']
    chatPanel.appendChild(newChat)
    // setChatHTML(newChat,)

    added_chats[username].addEventListener('click', () => {
        if (selectedChat !== 0 && selectedChat !== username) {
            setChatHTML(selectedChat, last_messages[selectedChat][0], last_messages[selectedChat][1], false)
        }
        let request = new XMLHttpRequest();
        request.open("POST", "/api/lastmessage", true);
        request.setRequestHeader('Content-Type', 'application/json');
        token = localStorage.getItem('token')
        authHeaderValue = "Bearer " + token
        request.setRequestHeader('Authorization', authHeaderValue);
        request.onreadystatechange = () => {
            if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                last_message = JSON.parse(request.responseText)

                console.log(last_message.shortenedMessage)
                console.log(last_message.msFromEpoch)

                date = new Date(Number(last_message.msFromEpoch))
                time = formattedDate(date)

                last_messages[username] = [last_message.shortenedMessage, time]

                setChatHTML(username, last_messages[username][0], last_messages[username][1], true)
            }
        }
        request.send(JSON.stringify({
            username
        }))

        selectedChat = username

        setCurrChatHTML(selectedChat, true)
        const messageHistoryPanel = document.querySelector('.convHistory')
        while (messageHistoryPanel.firstChild) {
            console.log('WTF')
            messageHistoryPanel.removeChild(messageHistoryPanel.lastChild);
        }
        loadMessageHistoryWith(selectedChat)
    })
}
function loadMessageHistoryWith(username) {
    socket.emit('messageHistory', { user: username, token: token })
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
    <div class='messageText'>${text}</div>
    <span class="timestamp">${date}</span>
    </div>`
}

function formattedDate(d = new Date) {
    return [d.getHours(), d.getMinutes()]
        .map(n => n < 10 ? `0${n}` : `${n}`).join(':')
        + '  '
        + [d.getDate(), d.getMonth() + 1, d.getFullYear()]
            .map(n => n < 10 ? `0${n}` : `${n}`).join('/');
}

function loadDialogs() {
    const authHeaderValue = "Bearer " + localStorage.getItem('token')

    let request = new XMLHttpRequest();
    request.open("POST", "/api/dialog-list", true)
    request.setRequestHeader('Authorization', authHeaderValue);

    request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            const searchResult = JSON.parse(request.responseText)
            const dialogList = JSON.parse(searchResult)

            for (let i = 0; i < dialogList.length; i++) {
                addChat(dialogList[i])
                setChatHTML(dialogList[i], '', '', false)

                let lastMessageRequest = new XMLHttpRequest();
                lastMessageRequest.open("POST", "/api/lastmessage", true);
                lastMessageRequest.setRequestHeader('Content-Type', 'application/json');
                lastMessageRequest.setRequestHeader('Authorization', authHeaderValue);

                lastMessageRequest.onreadystatechange = () => {
                    if (lastMessageRequest.readyState === XMLHttpRequest.DONE && lastMessageRequest.status === 200) {

                        const last_message = JSON.parse(lastMessageRequest.responseText)
                        const date = new Date(Number(last_message.msFromEpoch))
                        const time = formattedDate(date)

                        last_messages[dialogList[i]] = [last_message.shortenedMessage, time]
                        setChatHTML(dialogList[i], last_messages[dialogList[i]][0], last_messages[dialogList[i]][1], false)
                    }
                }
                lastMessageRequest.send(JSON.stringify({ username: dialogList[i] }))
            }

        }
    }
    request.send()
}




const socket = io()
socket.on('wrongToken', () => {
    window.location.href = "/login"
})
socket.on('message', ({ dialog, msFromEpoch, message, type }) => {
    console.log(dialog)
    console.log(msFromEpoch)
    console.log(message)
    unformattedDate = new Date(msFromEpoch)
    date = formattedDate(unformattedDate)
    console.log(date)

    if (!(dialog in added_chats)) addChat(dialog)
    let isChatSelected = false
    if (dialog === selectedChat) {
        addMessage(message, date, type)
        isChatSelected = true
        const messageHistoryPanel = document.querySelector('.convHistory')
        messageHistoryPanel.scrollTo(0, messageHistoryPanel.scrollHeight);
    }
    if (type === 'received') setChatHTML(dialog, message, date, isChatSelected)

})
// token is declared in chatCheck.js
socket.emit('online', { token: token })




const userSearchField = document.querySelector(`input[type="search"]`)
const replyField = document.querySelector(`input[type="text"]`)
const fileAttachButton = document.querySelector(`input[type="file"]`)
const added_chats = {}
const last_messages = {}
let selectedChat = 0

userSearchField.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return
    console.log(userSearchField.value)
    userSearchRequest(userSearchField.value)
    ////////////////////////////////////////////
})

replyField.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' || selectedChat === 0 || replyField.value === '') return

    const date = formattedDate()
    const msFromEpoch = Date.now()
    const messageHistory = document.querySelector(".convHistory")

    const message = replyField.value
    addMessage(message, date)
    replyField.value = ''
    messageHistory.scrollTo(0, messageHistory.scrollHeight);

    socket.emit("messageSent", { message: message, recepient: selectedChat, msFromEpoch: msFromEpoch })
})

fileAttachButton.addEventListener('change', () => {
    socket.emit()
})
loadDialogs()



