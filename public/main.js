let socket = io.connect('http://localhost:3000');
let items = document.querySelector(".items");


socket.on('data', (data) => {
    console.log(data);
});

//  <img class="content" src="${card.image}" alt=""></img>

function encode (input) {
    var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    while (i < input.length) {
        chr1 = input[i++];
        chr2 = i < input.length ? input[i++] : Number.NaN; // Not sure if the index 
        chr3 = i < input.length ? input[i++] : Number.NaN; // checks are needed here

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output += keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                  keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    return output;
}

socket.on('cards', (cards) => {
    cards.forEach((card) => {
        const bytes = new Uint8Array(card.image);

        items.innerHTML +=
        `
        <div class="card">
            <img class="content" src="data:image/png;base64,${encode(bytes)}">
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