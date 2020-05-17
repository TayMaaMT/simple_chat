function joinNs(endpoint) {
    if (nsSocket) {
        nsSocket.close();
        document.querySelector('.message-form').removeEventListener("submit", formSubmition)
    }
    nsSocket = io(`http://localhost:3000${endpoint}`);

    nsSocket.on('nsRoomLoad', (nsRooms) => {
        console.log(nsRooms);
        let roomList = document.querySelector('.room-list');
        roomList.innerHTML = " "
        nsRooms.forEach((room) => {
            console.log(room.roomTitle);
            let glpyh;
            if (room.privateRoom) {
                glpyh = "lock"
            } else {
                glpyh = "globe"
            }
            roomList.innerHTML += `<li class ="room"><span class="glyphicon glyphicon-${glpyh}"></span>${room.roomTitle}</li>`
        })

        document.querySelectorAll('.room').forEach((elem) => {
            elem.addEventListener('click', (e) => {

                const nsEndpoint = e.target.innerText;
                joinRoom(nsEndpoint);
            })
        })

        let TopRoom = document.querySelector('.room');
        let TopRoomName = TopRoom.innerText;
        joinRoom(TopRoomName);
    })


    nsSocket.on('messageToClient', (msg) => {
        console.log(msg);
        document.querySelector("#messages").innerHTML += buildHTML(msg) + "<br>";

    })


    document.querySelector('.message-form').addEventListener("submit", formSubmition)

}

function formSubmition(event) {
    event.preventDefault();
    const newmessage = document.querySelector('#user-message').value
    nsSocket.emit('messageToServer', {
        text: newmessage
    })

}

function buildHTML(msg) {
    const convertDate = new Date(msg.time).toLocaleString();
    const newHTML = `
                <li>
                    <div class="user-image">
                        <img src=${msg.avatar} />
                    </div>
                    <div class="user-message">
                        <div class="user-name-time">${msg.username} <span>${convertDate}</span></div>
                        <div class="message-text">${msg.text}</div>
                    </div>
                </li>
    `

    return newHTML;

}