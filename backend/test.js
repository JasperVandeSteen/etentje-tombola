const fs = require("fs");
let keysJson = fs.readFileSync("./keys.json");
let keys = JSON.parse(keysJson);
console.log(keys);

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

for (let i = 0; i < 1000; i++) {
    let key = makeid(5);
    keys.keys.push(key);
}

fs.writeFileSync("./keys.json", JSON.stringify(keys));