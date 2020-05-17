function joinRoom(roomName) {
    nsSocket.emit('joinRoom', roomName, (newNumberOfMembers) => {
        document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`
    });

    nsSocket.on('historyCatchUp', (history) => {

        const currentMsg = document.querySelector("#messages");
        currentMsg.innerHTML = "";
        history.forEach(msg => {
            const newMsg = buildHTML(msg)
            currentMsg.innerHTML += newMsg;
        });
    })

    nsSocket.on('updateNumbers', (newNumberOfMembers) => {
        document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user"></span>`
        document.querySelector('.curr-room-text').innerText = `${ roomName }`
    });

    let searchBox = document.querySelector('#search-box');
    searchBox.addEventListener('input', (e) => {
        console.log(e.target.value)
        let messages = Array.from(document.getElementsByClassName('message-text'));
        console.log(messages);
        messages.forEach((msg) => {
            if (msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1) {
                // the msg does not contain the user search term!
                msg.style.display = "none";
            } else {
                msg.style.display = "block"
            }
        })
    })


}