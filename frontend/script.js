let data;
let sound;
let noNameButKey = false;

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
        if (!noNameButKey) {
            let keyInput = prompt("Spel key:", '');
            if (!data.keys.includes(keyInput)) {
                alert("Ingevoerde key is fout!");
            } else if (data.usedKeys.includes(keyInput)) {
                alert("Ingevoerde key is reeds gebruikt!");
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
                    let player = prompt("Naam Speler" + "\r\n" + "(Volledige naam):", '');
                    if (player != null) {
                        sessionStorage.setItem("playing", true);
                        sessionStorage.setItem("player", player);

                        text.style.display = "none";
                        squareContainer.style.marginTop = "20vh";
                        document.getElementById("highScores").style.display = "none";

                        setTimeout(() => {
                            runGame();
                        }, 500);
                    } else {
                        noNameButKey = true;
                    }
                });
            }
        } else {
            let player = prompt("Naam Speler" + "\r\n" + "(Volledige naam):", '');
            if (player != null) {
                sessionStorage.setItem("playing", true);
                sessionStorage.setItem("player", player);

                text.style.display = "none";
                squareContainer.style.marginTop = "20vh";
                document.getElementById("highScores").style.display = "none";

                setTimeout(() => {
                    runGame();
                }, 500);
            } else {
                noNameButKey = true;
            }
        }
    } else {
        text.style.display = "none";
        squareContainer.style.marginTop = "20vh";
        document.getElementById("highScores").style.display = "none";

        setTimeout(() => {
            runGame();
        }, 500);
    }
}

function fetchKeys() {
    fetch("https://etentje-tombola-backend.herokuapp.com/api/getKeys")
        .then(response => {
            return response.json();
        })
        .then(jsondata => {
            data = jsondata[0];
            let sortedHighScores = [];
            let i = 1;
            Object.entries(data.highscores).map(score => {
                sortedHighScores.push(score);
            });

            let sort = sortedHighScores.sort(sortFunction);
            console.log(sort);
            sortedHighScores.forEach(score => {
                document.getElementById("highScores").innerHTML += `
                    <p>${i}. ${score[0]}: ${score[1]}</p>
                `;
                i++;
            });
            body.style.display = "block";
        });
}
fetchKeys();

function sortFunction(a, b) {
    return b[1] - a[1]
}

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
                let player = sessionStorage.getItem("player");

                if (data.highscores[player] < score || data.highscores[player] == undefined)
                    data.highscores[player] = score;
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
                }).then(() => {
                    alert("Je tijd is op!" + "\r\n" + "Jouw score was: " + score);
                    sessionStorage.clear();
                    location.reload();
                });

            }
        }, timeToThink + timeToSolve);
    }

    function checkSequence() {
        for (let i = 0; i < inputSequence.length; i++) {
            if (inputSequence[i] != sequence[i]) {
                gameOver = true;
                let player = sessionStorage.getItem("player");

                if (data.highscores[player] < score || data.highscores[player] == undefined)
                    data.highscores[player] = score;
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
                }).then(() => {
                    alert("Game Over!" + "\r\n" + "Jouw score was: " + score);
                    sessionStorage.clear();
                    location.reload();
                });
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
        checkSequence();
    });
    blue.addEventListener('click', (e) => {
        e.preventDefault();
        inputSequence.push(2);
        checkSequence();
    });
    green.addEventListener('click', (e) => {
        e.preventDefault();
        inputSequence.push(3);
        checkSequence();
    });
    yellow.addEventListener('click', (e) => {
        e.preventDefault();
        inputSequence.push(4);
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
    checkKey();
});

red.addEventListener('click', (e) => {
    e.preventDefault();
    sound = new Audio('./resources/beep1.mp3');
    sound.play();
});
blue.addEventListener('click', (e) => {
    e.preventDefault();
    sound = new Audio('./resources/beep2.mp3');
    sound.play();
});
green.addEventListener('click', (e) => {
    e.preventDefault();
    sound = new Audio('./resources/beep3.mp3');
    sound.play();
});
yellow.addEventListener('click', (e) => {
    e.preventDefault();
    sound = new Audio('./resources/beep4.mp3');
    sound.play();
});