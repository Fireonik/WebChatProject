let request = new XMLHttpRequest()
request.open("POST", "/chat", true);
let token = localStorage.getItem('token')
authHeaderValue = "Bearer " + token
request.setRequestHeader('Authorization', authHeaderValue);
request.send()
request.onreadystatechange = () => {
    if (request.status === 403) window.location.href = "/login"
}

