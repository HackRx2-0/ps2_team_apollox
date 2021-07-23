const client = require("mongodb").MongoClient;
const config = require("../../config/config.json");
const url = `mongodb://${config.user}:${config.password}@${config.host}/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false`;

let _db;
function initDb(callback) {
  if (_db) {
    console.warn("Trying to init DB again!");
    return callback(null, _db);
  }
  client.connect(
    url,
    {
      useUnifiedTopology: true,
    },
    connected
  );

  function connected(err, db) {
    if (err) {
      return callback(err);
    }
    console.log("Mongo-DB connected");
    _db = db.db(config.db);
    return callback(null, _db);
  }
}

function getDbMongo() {
  return _db;
}

module.exports = {
  getDbMongo,
  initDb,
};
