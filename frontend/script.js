let data;
let sound;

let body = document.getElementById("body");
let start = document.getElementById("start");
let text = document.getElementById("text");
let squareContainer = document.getElementById("squareContainer");

const red = document.getElementById("square1");
const blue = document.getElementById("square2");
const green = document.getElementById("square3");
const yellow = document.getElementById("square4");


function checkKey() {
    if (!sessionStorage.getItem("playing")) {
        let keyInput = prompt("Spel key:", '');
        if (!data.keys.includes(keyInput)) {
            alert("Ingevoerde key is fout!");
            checkKey();
        } else if (data.usedKeys.includes(keyInput)) {
            alert("Ingevoerde key is reeds gebruikt!");
            body.innerHTML = "";
            checkKey();
        } else if (!data.usedKeys.includes(keyInput) && data.keys.includes(keyInput)) {
            data.usedKeys.push(keyInput);
            let newValue = data.usedKeys;
            let updateValue = {
                $set: {
                    usedKeys: newValue
                }
            };
            fetch('https://etentje-tombola-backend.herokuapp.com/api/useKey/6233bc7c2a95dc8efb1e6494', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(updateValue)
            }).then(() => {
                sessionStorage.setItem("playing", true);
                let player = prompt("Naam Speler:", '');
                sessionStorage.setItem("player", player);
            });
        }
    }
}

function fetchKeys() {
    fetch("https://etentje-tombola-backend.herokuapp.com/api/getKeys")
        .then(response => {
            return response.json();
        })
        .then(jsondata => {
            data = jsondata[0];
            console.log(data);
            checkKey();
        });
}
fetchKeys();

function runGame() {
    let sequence = [];
    let inputSequence = [];
    let completed = false;
    let gameOver = false;

    let timeToThink = 3000;
    let timeToSolve = 1000;

    let score = 0;
    let timer;

    function awaitInput() {
        inputSequence = [];
        completed = false;

        timer = setTimeout(() => {
            if (!completed && !gameOver) {
                alert("Je tijd is op!" + "\r\n" + "Jouw score was: " + score);

                data.highscores[sessionStorage.getItem("player")] = score;
                let updateValue = {
                    $set: {
                        highscores: data.highscores
                    }
                };
                fetch('https://etentje-tombola-backend.herokuapp.com/api/addHighScore/6233bc7c2a95dc8efb1e6494', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(updateValue)
                });

                sessionStorage.clear();
                location.reload();
            }
        }, timeToThink + timeToSolve);
    }

    function checkSequence() {
        for (let i = 0; i < inputSequence.length; i++) {
            if (inputSequence[i] != sequence[i]) {
                gameOver = true;
                alert("Game Over!" + "\r\n" + "Jouw score was: " + score);

                data.highscores[sessionStorage.getItem("player")] = score;
                let updateValue = {
                    $set: {
                        highscores: data.highscores
                    }
                };
                fetch('https://etentje-tombola-backend.herokuapp.com/api/addHighScore/6233bc7c2a95dc8efb1e6494', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(updateValue)
                });
                sessionStorage.clear();
                location.reload();
            }
        }

        if (inputSequence.length == sequence.length) {
            score++;
            console.log(score);

            timeToSolve += 500;
            completed = true;
            clearTimeout(timer);

            let selected = randomIntFromInterval(1, 4);
            playSequence(selected);
        }
    }

    function playSequence(square) {
        let i = 0;
        sequence.push(square);

        function callTimeOut() {
            setTimeout(() => {
                playSquare(sequence[i]);
            }, 3000 / 6);
        }
        callTimeOut();

        function playSquare(sq) {
            switch (sq) {
                case 1:
                    sound = new Audio('./resources/beep1.mp3');
                    sound.play();
                    red.style.opacity = "1";
                    setTimeout(() => {
                        red.style.opacity = "0.7";
                    }, 3000 / 10);
                    break;
                case 2:
                    sound = new Audio('./resources/beep2.mp3');
                    sound.play();
                    blue.style.opacity = "1";
                    setTimeout(() => {
                        blue.style.opacity = "0.7";
                    }, 3000 / 10);
                    break;
                case 3:
                    sound = new Audio('./resources/beep3.mp3');
                    sound.play();
                    green.style.opacity = "1";
                    setTimeout(() => {
                        green.style.opacity = "0.7";
                    }, 3000 / 10);
                    break;
                case 4:
                    sound = new Audio('./resources/beep4.mp3');
                    sound.play();
                    yellow.style.opacity = "1";
                    setTimeout(() => {
                        yellow.style.opacity = "0.7";
                    }, 3000 / 10);
                    break;
                default:
                    break;
            }

            if (i < sequence.length - 1) {
                i++;
                callTimeOut();
            } else {
                awaitInput();
            }
        }
    }

    red.addEventListener('click', (e) => {
        e.preventDefault();
        inputSequence.push(1);

        sound = new Audio('./resources/beep1.mp3');
        sound.play();

        checkSequence();
    });
    blue.addEventListener('click', (e) => {
        e.preventDefault();
        inputSequence.push(2);

        sound = new Audio('./resources/beep2.mp3');
        sound.play();

        checkSequence();
    });
    green.addEventListener('click', (e) => {
        e.preventDefault();
        inputSequence.push(3);

        sound = new Audio('./resources/beep3.mp3');
        sound.play();

        checkSequence();
    });
    yellow.addEventListener('click', (e) => {
        e.preventDefault();
        inputSequence.push(4);

        sound = new Audio('./resources/beep4.mp3');
        sound.play();

        checkSequence();
    });

    let selected = randomIntFromInterval(1, 4);
    playSequence(selected);
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

start.addEventListener('click', (e) => {
    e.preventDefault();
    text.style.display = "none";
    squareContainer.style.marginTop = "20vh";

    setTimeout(() => {
        runGame();
    }, 500);
});