/* Pega todas as imagens */
const cards_el = document.getElementsByClassName("card");
var cards = [];

var container = document.querySelector('.container');
var circle = null;
var state = { distX: 0, distY: 0 };

for (let i = 0; i < cards_el.length; i++) {
    let card = cards_el[i];
    cards.push({
        coordX: card.style.left,
        coordY: card.style.top,
        offsetX: card.clientX,
        offsetY: card.clientY,
        lastmouseX: 0,
        lastmouseY: 0,
        dragging: false
    });

    console.log(cards[i]);
    /* Adiciona um evento de flipping para cada imagem */
    card.addEventListener("dblclick", function() {
        card.classList.toggle("flipCard");
    }, false);

    card.addEventListener("dragstart", function(e) {
        // O target é o elemento card
        var targ = cards_el[i];

        // Pega a posição atual do mouse
        cards[i].offsetX = e.clientX;
        cards[i].offsetY = e.clientY;
        lastmouseX = e.clientX;
        lastmouseY = e.clientY;

        // Cria posição default do card se não existir
        if (!targ.style.left) { targ.style.left = '0px' };
        if (!targ.style.top) { targ.style.top = '0px' };

        // Calcula as coordenadas do card
        cards[i].coordX = parseInt(targ.style.left);
        cards[i].coordY = parseInt(targ.style.top);
        cards[i].drag = true;
    }, false);

    card.addEventListener("drag", function(e) {
        if (!cards[i].drag) return;
        if (e.clientX == 0 && e.clientY == 0) return;
        let diffX = Math.abs(cards[i].lastmouseX - e.clientX);
        let diffY = Math.abs(cards[i].lastmouseY - e.clientY);
        if (diffX < 10 && diffY < 10) return;
        var targ = cards_el[i];
        // Move o elemento card baseado na posição inicial e na posição inicial 
        // do mouse no drag, e na posição atual do drag
        targ.style.left = cards[i].coordX + e.clientX - cards[i].offsetX + 'px';
        targ.style.top = cards[i].coordY + e.clientY - cards[i].offsetY + 'px';
        cards[i].lastmouseX = e.clientX;
        cards[i].lastmouseY = e.clientY;
    }, false);

    card.addEventListener("dragend", function(e) {
        cards[i].drag = false;
    }, false);
}

const signs = document.querySelectorAll('x-sign')
const randomIn = (min, max) => (
    Math.floor(Math.random() * (max - min + 1) + min)
)

const mixupInterval = el => {
    const ms = randomIn(2000, 4000)
    el.style.setProperty('--interval', `${ms}ms`)
}

signs.forEach(el => {
    mixupInterval(el)
    el.addEventListener('webkitAnimationIteration', () => {
        mixupInterval(el)
    })
})

var musicas = [
    { trecho: 'Te amarei de Janeiro a Janeiro, até o mundo acabar', id: 'janeiroajaneiro', title: 'De janeiro a Janeiro - Roberta Campos/Nando Reis' },
    { trecho: 'Well I found a woman, stronger than anyone I know... She shares my dreams, I hope that someday I\'ll share her home', id: 'perfect', title: 'Perfect - Ed Sheeran' },
    { trecho: 'Tu, que tem esse abraço casa, se decidir bater asa, e leva contigo pra passear, eu juro, afeto e paz não vão te faltar', id: 'trevo', title: 'Trevo (Tu) - Anavitória/Tiago Iorc' },
    { trecho: 'Você é a razão da minha felicidade, não vá dizer que eu não sou sua cara-metade', id: 'meuabrigo', title: 'Meu Abrigo - Melim' },
    { trecho: 'De todos os loucos do mundo, eu quis você, porque a sua loucura parece um pouco com a minha', id: 'loucos', title: 'De todos os loucos do mundo - Clarice Falcão' },
    { trecho: 'E eu acho que eu gosto mesmo de você, bem do jeito que você é!', id: 'equalize', title: 'Equalize - Pitty' },
    { trecho: 'Eu quero partilhar, eu quero partilhar, a vida boa com você', id: 'partilhar', title: 'Partilhar - Rubel/Anavitória' },
    { trecho: 'Don\'t you worry about the distance, I\'m right there if you get lonely', id: 'heythere', title: 'Hey there Delilah - Plain White T\'s' }
]

const sticky_notes = document.getElementById("notes");

for (let i = 0; i < musicas.length; i++) {
    console.log(musicas[i]);

    // Add the music to the sticky list
    sticky_notes.innerHTML += `<div class="elemento" id="` + musicas[i].id + `"><div class="conteudo">` + musicas[i].trecho + `</div></div> `

    // get the note
    let note = document.getElementById(musicas[i].id);

    // Tilt the note randomly
    let degree = Math.random() * 12 - 6;
    note.style.transform = 'rotate(' + degree + 'deg)';
}
sticky_notes.innerHTML += `<div class="elemento" id="playlist"><div class="conteudo">Eu fiz uma playlist especial! Espero que goste. <3</div></div>`
document.getElementById("playlist").addEventListener("click", function() {
    window.open("https://open.spotify.com/playlist/44Cxi0NlZGc26wh9t6q0AL", '_blank').focus();
}, false);
// iterate each music playing it
const notes = document.getElementsByClassName("elemento");
for (let i = 0; i < notes.length; i++) {
    if (i < musicas.length) {
        let note = notes[i];
        note.addEventListener("click", function() {
            autoplay = true;
            playing = true;
            let player = document.getElementById("player");
            player.src = "songs/" + musicas[i].id + ".mp3";
            player.play();
            player.volume = document.getElementById("player_volume").value / 100.0;
            document.getElementById("musica").innerHTML = musicas[i].title;
        }, false);
    }
}

// Auto play first music
/*var playing = false;
var autoplay = false;
window.onclick = function() {
    if (!autoplay) {
        document.getElementById("musica").innerHTML = musicas[0].title;
        document.getElementById("player").volume = document.getElementById("player_volume").value / 100.0;
        document.getElementById("player").play();
        playing = true;
        autoplay = true;
    }
}*/

document.getElementById("player_volume").oninput = function(e) {
    let volume = document.getElementById("player_volume").value;
    document.getElementById("player").volume = volume / 100.0;
}

document.getElementById("playpause").onclick = function(e) {
    console.log(e)
    document.getElementById("musica").innerHTML = musicas[0].title;
    document.getElementById("player").volume = document.getElementById("player_volume").value / 100.0;
    if (!playing) {
        console.log("playing")
        document.getElementById("player").play();
        playing = true;
    } else {
        console.log("pausing")
        document.getElementById("player").pause();
        playing = false;
    }
}

var count = 0;

document.getElementById("destravar").addEventListener("click", function(e) {
    let value = document.getElementById("senha").value;
    if (value == "30/11") {
        document.getElementById("trava").style.display = "none";
        document.getElementById("content").style.display = "block";
        document.getElementById("musica").innerHTML = musicas[0].title;
        document.getElementById("player").volume = document.getElementById("player_volume").value / 100.0;
        document.getElementById("player").play();
        playing = true;
        autoplay = true;
    } else {
        count++;
        if (count < 5)
            alert("Senha errada.");
        else
            alert("Uma ajudinha? É uma data do mês de novembro.");
        document.getElementById("senha").value = "";
    }
}, false);