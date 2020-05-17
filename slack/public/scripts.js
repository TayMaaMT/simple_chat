const username = prompt("Whate is your name ??");
const socket = io('http://localhost:3000', {
    query: {
        username
    }
});
let nsSocket;
socket.on('nsList', (nsData) => {
    let namespaceDiv = document.querySelector('.namespaces')
    namespaceDiv.innerHTML = "";
    nsData.forEach((ns) => {
        namespaceDiv.innerHTML += `<div class ="namespace" ns=${ns.endpoint}><img src="${ns.img}"></div>`
    })
    document.querySelectorAll('.namespace').forEach((elem) => {
        elem.addEventListener('click', (e) => {
            const nsEndpoint = elem.getAttribute('ns');
            console.log(nsEndpoint);
            joinNs(nsEndpoint);
        })
    })

});