const MongoClient = require('mongodb').MongoClient;

//TODO: update mongoDB config URL
const configs = require('./configs').mongoUrl;

let client;
const dbName = 'words';

getDb = ( async() => {
    if( !client ) {
        try {
            client = await MongoClient.connect(configs, { useUnifiedTopology: true });
        } catch (e) { 
            return getDb(); 
        }
    }

    return client.db(dbName);
});

module.exports = getDb;