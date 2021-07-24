const jwt = require("jsonwebtoken");
const secret = require("../../config/config.json").secretString;
const getDbMongo = require("../helpers/dbMongo").getDbMongo;

exports.verifyToken = (token) => {
  console.log("Verifying token in socket");
  if (!token) return false;
  if (token.indexOf("Bearer") !== 0) return false;
  const tokenString = token.split(" ")[1];

  try {
    const decodedToken = jwt.verify(tokenString, secret);
    return decodedToken;
  } catch (err) {
    console.log(err);
    return false;
  }
};

exports.addChatToDatabase = (chat) => {
  console.log("adding to DB");
  getDbMongo()
    .collection("group_chats")
    .insertOne(chat, (err, result) => {
      if (err) {
        console.log("Chat did not upload to db");
      } else {
        console.log("Chat uploaded to db");
      }
    });
};

exports.addChatToDatabasePrivate = (chat) => {
  console.log("adding to DB");
  getDbMongo()
    .collection("group_chats")
    .insertOne(chat, (err, result) => {
      if (err) {
        console.log("Chat did not upload to db");
      } else {
        console.log("Chat uploaded to db");
      }
    });
};
