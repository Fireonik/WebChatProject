usersOnline = []

function addToOnline(id, username) {
    const user = { id: id, username: username }

    usersOnline.push(user)
    console.log(usersOnline)
}

function removeFromOnline(id) {
    const index = usersOnline.findIndex(user => user.id === id)
    usersOnline.splice(index, 1)
    console.log(usersOnline)
}

function getUsernameById(id) {
    const index = usersOnline.findIndex(user => user.id === id)
    console.log(usersOnline)
    console.log(usersOnline[index].username)
    return usersOnline[index].username
}

module.exports = {
    addToOnline,
    removeFromOnline,
    getUsernameById
}
