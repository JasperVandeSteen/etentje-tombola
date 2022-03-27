const fs = require("fs");

const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');

const app = express();
const bgRouter = express.Router();
const port = process.env.PORT || 3000;

let usedKey;

// Middle ware
app.use(bodyparser.urlencoded({
    limit: '50mb',
    extended: true
}));
app.use(bodyparser.json({
    limit: '50mb'
}));
app.use(cors());

bgRouter.route('/getKeys')
    .get((req, res) => {
        const collection = db.collection("keysAndScores");

        collection.find(req.query).toArray((error, result) => {
            if (error) {
                return res.status(500).send(error);
            }
            res.json(result);
        });
    });

bgRouter.route('/useKey/:Id')
    .patch((req, res) => {
        async function findId() {
            try {
                const collection = db.collection("keysAndScores");
                let id = new ObjectID(req.params.Id);
                collection.updateOne({
                    "_id": id
                }, req.body).then(result => {
                    console.log(result);
                    res.send('updated');
                });
            } catch (err) {
                return err;
            }
        }
        findId();
    });

bgRouter.route('/addHighScore/:Id')
    .patch((req, res) => {
        async function findId() {
            try {
                const collection = db.collection("keysAndScores");

                let id = new ObjectID(req.params.Id);
                collection.updateOne({
                    "_id": id
                }, req.body).then(result => {
                    console.log(result);
                    res.send('updated');
                });
            } catch (err) {
                return err;
            }
        }
        findId();
    });

app.get('/', (req, res) => {
    res.send("server is up...")
});

app.use('/api', bgRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);

    client.connect(err => {
        if (err) {
            throw err;
        }
        db = client.db(dbName);

        console.log("Connected correctly to server");
    });
});

const {
    MongoClient,
    ServerApiVersion,
    ObjectID
} = require('mongodb');
const uri = "mongodb+srv://admin:adminProjecten4463@cluster0.topzp.mongodb.net/Etentje-tombola?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});

// The database to use
const dbName = "Etentje-tombola";
let db;