let socket = io.connect('http://localhost:3000');
let items = document.querySelector(".items");


socket.on('data', (data) => {
    console.log(data);
});

socket.on('cards', (cards) => {
    cards.forEach((card) => {
        items.innerHTML +=
        `
        <div class="card">
            <img class="content" src="${card.image}" alt="">
            <h1>${card.name}</h1>
            <p>${card.desc}</p>
            <button>Download</button>
        </div>
        `;
    });
});


let search = document.querySelector("#search");

search.addEventListener('keyup', (input) => {
    items.innerHTML = ``;
    socket.emit('find', search.value);
});