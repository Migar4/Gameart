//Normal data
socket.on('data', (data) => {
    console.log(data);
});


//when cards are recieved
socket.on('cards', (cards) => {

    cards.forEach((card) => {
        const bytes = new Uint8Array(card.image);
        
        items.innerHTML +=
        `
        <div class="card">
            <img class="content" src="data:image/png;base64,${encode(bytes)}">
            <h1>${card.name}</h1>
            <p>${card.desc}</p>
            <button type="button" class="download" onclick="download('${card.id}')">Download</button>
        </div>
        `;
    });
});


//when the search is typed
search.addEventListener('keyup', (input) => {
    items.innerHTML = ``;
    socket.emit('find', search.value);
});
