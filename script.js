const canvas = document.getElementById('canvas')
const stopButton = document.getElementById('stopButton')
var active = true;
let lose = false
let win = false
var start = document.getElementById("start");
var navbar = document.getElementById("navbar");
var game = document.getElementById("game");
var modal = document.getElementById("myModal");
var modalHowTo = document.getElementById("modalHowToPlay");
var span = document.getElementsByClassName("close")[0];
var spanHowTo = document.getElementsByClassName("closeHowTo")[0];
let playerSpeed = document.getElementById("playerspeed").value;
let difficulty = document.getElementById("difficulty").value;
let difficultyLabel = document.getElementById("difficultyLabel");
let speedLabel = document.getElementById("speedLabel");
let x;
let time = (difficulty == 'easy' ? 10 : difficulty == 'medium' ? 20 : 30)
const playerImage = document.getElementById('source')

$('#game').hide() 

const playerStart = {
    x: 20,
    y: 200,
    dx: 0,
    dy: 0
}

const player = {
    w: 10,
    h: 100,
    x: playerStart.x,
    y: playerStart.y,
    speed: 10,
    dx: 0,
    dy: 0
}

const circleStart = {
    x: 40,
    y: 200
}

const circle = {
    x: circleStart.x,
    y: circleStart.y,
    size: 10,
    dx: Math.random() * 1 + 4,
    dy: (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 1 + 3)
}

const ctx = canvas.getContext('2d');

ctx.beginPath();

function clear() {
    ctx.clearRect(0,0, canvas.width, canvas.height)
}

function drawCircle() {
    ctx.beginPath()
    ctx.arc(circle.x, circle.y, circle.size, 0, Math.PI * 2)
    ctx.fillStyle = 'purple'
    ctx.fill()
}

function newCirclePosition() {
    circle.x += circle.dx
    circle.y += circle.dy

    // detect end horizontal
    if (circle.x + circle.size > canvas.width) {
        circle.dx *= -1
    }

    // if hitting racket
    if (((circle.x - circle.size < player.x)) && ((circle.y - circle.size > player.y) && ((circle.y + circle.size) < (player.y + player.h)))) {
        circle.dx *= -1
        circle.dy *= -1 * (Math.random() * 1 + 1)
    }

    // detect end vertical
    if (circle.y + circle.size > canvas.height || circle.y - circle.size < 0) {
       circle.dy *= -1
    }

    // if go outside window
    if (circle.x - circle.size < 0) {
        active = false
        lose = true
    }
}

function drawPlayer() {
    // ctx.drawImage(image, player.x, player.y, player.w, player.h)
    ctx.fillStyle = 'green';
    ctx.fillRect(player.x, player.y, player.w, player.h);
}

function newPlayerPosition() {
    player.x += player.dx
    player.y += player.dy

    if (player.y + player.h > canvas.height) {
        player.y = canvas.height - player.h
    }

    if (player.y < 0) {
        player.y = 0
    }
}

function clearAndResetAll() {
    clear()
    circle.x = circleStart.x
    circle.y = circleStart.y
    circle.dx = (Math.random() * 1 + 4)
    circle.dy = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 1 + 3)
    player.x = playerStart.x
    player.y = playerStart.y
    player.dx = playerStart.dx
    player.dy = playerStart.dy
}

function imageUpdate() {
    clear()

    drawPlayer()
    newPlayerPosition()

    drawCircle()
    newCirclePosition()

    if (active) {
        requestAnimationFrame(imageUpdate)
    } else if (lose) {
        cancelAnimationFrame(imageUpdate)
        setLose()
    } else if (win) {
        cancelAnimationFrame(imageUpdate)
        setWin()
    } else {
        cancelAnimationFrame(imageUpdate)
        clearAndResetAll()
        drawCircle()
        drawPlayer() 
    }
}

function keydown(e) {
    if (e.key == 'ArrowUp' || e.key == 'Up') {
        moveUp()
    } else if (e.key == 'ArrowDown' || e.key == 'Down') {
        moveDown()
    }
}

function moveUp() {
    player.dy = -player.speed
}

function moveDown() {
    player.dy = player.speed
}

function keyup(e) {
    player.dx = 0
    player.dy = 0
    // console.log(e.key)
}

document.addEventListener('keydown', keydown)
document.addEventListener('keyup', keyup)

drawCircle()
drawPlayer() 

function playGame(event) {
    event.preventDefault()
    playerSpeed = document.getElementById("playerspeed").value;
    difficulty = document.getElementById("difficulty").value;

    time = (difficulty == 'easy' ? 10 : difficulty == 'medium' ? 20 : 30)
    document.getElementById("timer").innerHTML =+ time + "s "

    player.speed = playerSpeed == 'slow' ? 5 : playerSpeed == 'medium' ? 10 : 20
    player.h = difficulty == 'easy' ? 100 : difficulty == 'medium' ? 75 : 50
    playerStart.y = (canvas.width / 2) - (player.h / 2)
    player.y = playerStart.y
    circleStart.y = (playerStart.y + ((player.h + playerStart.y) - playerStart.y)/2)

    clearAndResetAll()
    drawCircle()
    drawPlayer()

    $('#difficultyLabel').html(difficulty)
    $('#speedLabel').html(playerSpeed)
    $('#start').hide() 
    $('#game').show() 
}

function startTimer() {
    // console.log('START TIMER')
    clearInterval(x);
    var countDownDate = new Date((new Date().getTime() + (time+1) * 1000)).getTime();

    x = setInterval(function() {
        var now = new Date().getTime()
        var distance = countDownDate - now;
        let seconds = Math.floor(distance / 1000)
        // console.log(seconds, 'seconds')
    
        document.getElementById("timer").innerHTML =+ seconds + "s "

        if (distance < 0) {
            clearInterval(x);
            active = false
            win = true
        }
    }, 1000)
}

function startGame() {
    // console.log(circle.dx, circle.dy, 'DX, DY')
    active = true
    win = false
    lose = false
    $('#modalWin').hide()
    $('#modalLose').hide() 
    startTimer();

    imageUpdate()
}

function setWin() {
    // console.log('SET WIN')
    modal.style.display = "flex";
    $('#modalWin').show() 
    document.getElementById("timer").innerHTML = "YOU WIN!"
    clearTimeout(x)
}

function setLose() {
    // console.log('SET LOSE')
    modal.style.display = "flex";
    $('#modalLose').show() 
    document.getElementById("timer").innerHTML = "YOU LOSE!"
    clearTimeout(x)
}

function stopGame() {
    active = false
    clearAndResetAll()
    drawCircle()
    drawPlayer() 
    clearTimeout(x)
    document.getElementById("timer").innerHTML =+ time + "s "
}

function toHome() {
    active = false
    clearAndResetAll()
    drawCircle()
    drawPlayer() 
    clearTimeout(x)
    document.getElementById("timer").innerHTML =+ time + "s "
    $('#difficultyLabel').empty()
    $('#speedLabel').empty()
    $('#start').show() 
    $('#game').hide() 
}

span.onclick = function() {
    modal.style.display = "none";
    $("#timer").empty()
    clearAndResetAll()
    drawCircle()
    drawPlayer()
    document.getElementById("timer").innerHTML =+ time + "s "
}

function howToPlay() {
    modalHowTo.style.display = "flex"
}

spanHowTo.onclick = function() {
    modalHowTo.style.display = "none";
}