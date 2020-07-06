let socket = io.connect('http://localhost:3000');
let items = document.querySelector(".items");


let search = document.querySelector("#search");



//function when download is pressed
function download(id){
    let win = window.open('/download/' + id);
    win.focus();
}
