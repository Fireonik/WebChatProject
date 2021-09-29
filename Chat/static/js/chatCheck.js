let request = new XMLHttpRequest()
request.open("POST", "/chat", true);
token = localStorage.getItem('token')
console.log("asdasfd " + token)
authHeaderValue = "Bearer " + token
request.setRequestHeader('Authorization', authHeaderValue);
request.send()
request.onreadystatechange = () => {
    if (request.status === 403) window.location.href = "/login"
}

