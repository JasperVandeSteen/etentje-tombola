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

    if (!sessionStorage.getItem('tries')) {
        sessionStorage.setItem('tries', 3);
    }

    function awaitInput() {
        inputSequence = [];
        completed = false;

        timer = setTimeout(() => {
            if (!completed && !gameOver) {
                let player = sessionStorage.getItem("player");
                if (sessionStorage.getItem('tries') > 1) {
                    let oldValue = sessionStorage.getItem("tries");
                    let newValue = oldValue - 1;
                    if (sessionStorage.getItem('score')) {
                        let previousScore = sessionStorage.getItem('score');
                        if (score > previousScore) {
                            sessionStorage.setItem('score', score);
                        }
                    } else {
                        sessionStorage.setItem('score', score);
                    }

                    alert("Je tijd is op! Je mag nog " + (newValue) + " keer proberen... | Score = " + score);
                    sessionStorage.setItem("tries", newValue);
                    location.reload();
                } else {
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
                        let finalScore;
                        let previousScore = sessionStorage.getItem('score');
                        if (score > previousScore) {
                            finalScore = score;
                        } else {
                            finalScore = sessionStorage.getItem('score');
                        }

                        alert("Je tijd is op!" + "\r\n" + "Jouw top score was: " + finalScore);
                        sessionStorage.clear();
                        location.reload();
                    });
                }
            }
        }, timeToThink + timeToSolve);
    }

    function checkSequence() {
        for (let i = 0; i < inputSequence.length; i++) {
            if (inputSequence[i] != sequence[i]) {
                gameOver = true;
                let player = sessionStorage.getItem("player");

                if (sessionStorage.getItem('tries') > 1) {
                    let oldValue = sessionStorage.getItem("tries");
                    let newValue = oldValue - 1;
                    if (sessionStorage.getItem('score')) {
                        let previousScore = sessionStorage.getItem('score');
                        if (score > previousScore) {
                            sessionStorage.setItem('score', score);
                        }
                    } else {
                        sessionStorage.setItem('score', score);
                    }

                    alert("Game Over! Je mag nog " + (newValue) + " keer proberen... | Score = " + score);
                    sessionStorage.setItem("tries", newValue);
                    location.reload();
                } else {
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
                        let finalScore;
                        let previousScore = sessionStorage.getItem('score');
                        if (score > previousScore) {
                            finalScore = score;
                        } else {
                            finalScore = sessionStorage.getItem('score');
                        }

                        alert("Je tijd is op!" + "\r\n" + "Jouw top score was: " + finalScore);
                        sessionStorage.clear();
                        location.reload();
                    });
                }
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
                    playSound("beep1");
                    red.style.opacity = "1";
                    setTimeout(() => {
                        red.style.opacity = "0.7";
                    }, 3000 / 10);
                    break;
                case 2:
                    playSound("beep2");
                    blue.style.opacity = "1";
                    setTimeout(() => {
                        blue.style.opacity = "0.7";
                    }, 3000 / 10);
                    break;
                case 3:
                    playSound("beep3");
                    green.style.opacity = "1";
                    setTimeout(() => {
                        green.style.opacity = "0.7";
                    }, 3000 / 10);
                    break;
                case 4:
                    playSound("beep4");
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

function preLoadSounds() {
    var preload = new createjs.LoadQueue();
    preload.loadFile("./resources/beep1.mp3");
    preload.loadFile("./resources/beep2.mp3");
    preload.loadFile("./resources/beep3.mp3");
    preload.loadFile("./resources/beep4.mp3");
}

function loadSounds() {
    createjs.Sound.registerSound("./resources/beep1.mp3", "beep1");
    createjs.Sound.registerSound("./resources/beep2.mp3", "beep2");
    createjs.Sound.registerSound("./resources/beep3.mp3", "beep3");
    createjs.Sound.registerSound("./resources/beep4.mp3", "beep4");
}

function playSound(soundID) {
    createjs.Sound.play(soundID);
}

preLoadSounds();
loadSounds();

start.addEventListener('click', (e) => {
    e.preventDefault();
    checkKey();
});

red.addEventListener('click', (e) => {
    e.preventDefault();
    red.style.opacity = "1";
    setTimeout(() => {
        red.style.opacity = "0.7";
    }, 3000 / 10);
});
blue.addEventListener('click', (e) => {
    e.preventDefault();
    blue.style.opacity = "1";
    setTimeout(() => {
        blue.style.opacity = "0.7";
    }, 3000 / 10);
});
green.addEventListener('click', (e) => {
    e.preventDefault();
    green.style.opacity = "1";
    setTimeout(() => {
        green.style.opacity = "0.7";
    }, 3000 / 10);
});
yellow.addEventListener('click', (e) => {
    e.preventDefault();
    yellow.style.opacity = "1";
    setTimeout(() => {
        yellow.style.opacity = "0.7";
    }, 3000 / 10);
});