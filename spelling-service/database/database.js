const MongoClient = require('mongodb').MongoClient;
const configs = require('../config/configs').mongoUrl;

let client, attempts = 0;
const dbName = 'words';

async function getDb() {
    if (!client) {
        if (attempts > 2) {
            throw new Error("Can't connect to " + configs());
        }
        try {
            console.log("Init connection " + configs());
            client = await MongoClient.connect(configs(), { useUnifiedTopology: true });
            attempts = 0;
        } catch (e) {
            console.log(e.message)
            attempts++;
            return getDb();
        }
    }
    return client.db(dbName);
}

module.exports = async (collectionName) => {
    const db = await getDb();
    return db.collection(collectionName);
};