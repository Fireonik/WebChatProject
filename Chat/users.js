const usersOnline = []

function addToOnline(id, username) {
    const user = { id, username }

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
    return usersOnline[index].username
}

function getIdByUsername(username) {
    const index = usersOnline.findIndex(user => user.username === username)
    if (index === -1) return -1
    return usersOnline[index].id
}

module.exports = {
    addToOnline,
    getUsernameById,
    removeFromOnline,
    getIdByUsername
}
