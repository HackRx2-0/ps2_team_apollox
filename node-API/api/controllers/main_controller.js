"use strict";

const db = require("../helpers/db");
const getDbMongo = require("../helpers/dbMongo").getDbMongo;

const moment = require("moment");
const { ObjectId } = require("mongodb");
const uuid = require("short-uuid");
const auth = require("../helpers/auth");

const sharp = require("sharp");

const { addChatToDatabase } = require("../helpers/socket");

const firebaseAdmin = require("firebase-admin");
const firebaseKey = require("../../config/firebase_key.json");
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseKey),
});

const { send200, send400 } = require("../helpers/response");

function getCurrTime(isMongo) {
  if (!isMongo) return moment().format("YYYY-MM-DD hh:mm:ss");
  else return moment().toDate();
}

exports.userLoginOtp = (req, res) => {
  const token = req.body.token;
  firebaseAdmin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      const phoneNo = decodedToken.firebase.identities.phone[0];
      let sqlFind = `SELECT uid, name, email_id, phone_no, role 
                      FROM users 
                      WHERE phone_no = '${phoneNo}'`;

      db.query(sqlFind, (err, result) => {
        if (err) return send400(err, req, res, "Could not get user info");

        if (result.length === 0) {
          //New User
          const uid = uuid.generate().substr(0, 8);
          let sqlInsert = `INSERT INTO users (uid, phone_no, role, create_time) 
                           VALUES ('${uid}', '${phoneNo}', 'user', '${getCurrTime()}')`;

          db.query(sqlInsert, (err, result) => {
            if (err) return send400(err, req, res, "New User could not be inserted");
            const foundUser = {
              uid: uid,
              phone_no: phoneNo,
              role: "user",
            };

            let token = auth.issueToken(foundUser);
            return send200(req, res, {
              ...foundUser,
              token,
              isNewUser: true,
              authMode: "phone",
            });
          });
        } else {
          //Existing User
          let foundUser = result[0];
          let tokenIssue = { ...foundUser };
          delete tokenIssue.create_time;
          delete foundUser.create_time;
          delete foundUser.role;

          let token = auth.issueToken(tokenIssue);

          console.log({ ...foundUser, token });

          if (foundUser.email_id == null || foundUser.name === null) {
            return send200(req, res, { ...foundUser, isNewUser: true, authMode: "phone", token });
          }

          send200(req, res, { ...foundUser, isNewUser: false, authMode: "phone", token });
        }
      });
    })
    .catch((error) => {
      send400(error, req, res, "Bad Token");
    });
};

exports.userLoginGoogle = (req, res) => {
  const token = req.body.token;
  firebaseAdmin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      const emailId = decodedToken.firebase.identities.email[0];
      let sqlFind = `SELECT uid, name, email_id, phone_no, role 
                      FROM users 
                      WHERE email_id = '${emailId}'`;

      db.query(sqlFind, (err, result) => {
        if (err) return send400(err, req, res, "Could not get user info");

        if (result.length === 0) {
          //New User
          const uid = uuid.generate().substr(0, 8);
          let sqlInsert = `INSERT INTO users (uid, email_id, role, create_time) 
                           VALUES ('${uid}', '${emailId}', 'user', '${getCurrTime()}')`;

          db.query(sqlInsert, (err, result) => {
            if (err) return send400(err, req, res, "New User could not be inserted");
            const foundUser = {
              uid: uid,
              email_id: emailId,
              role: "user",
            };

            let token = auth.issueToken(foundUser);
            return send200(req, res, {
              ...foundUser,
              token,
              isNewUser: true,
              authMode: "googleOAuth",
            });
          });
        } else {
          //Existing User
          let foundUser = result[0];
          let tokenIssue = { ...foundUser };
          delete tokenIssue.create_time;
          delete foundUser.create_time;
          delete foundUser.role;
          let token = auth.issueToken(tokenIssue);

          if (foundUser.phone_no == null || foundUser.name === null) {
            return send200(req, res, {
              ...foundUser,
              isNewUser: true,
              authMode: "googleOAuth",
              token,
            });
          }

          console.log({ ...foundUser, token });
          send200(req, res, { ...tokenIssue, authMode: "googleOAuth", isNewUser: false, token });
        }
      });
    })
    .catch((error) => {
      send400(error, req, res, "Bad Token");
    });
};

exports.getUser = (req, res) => {
  let sql = `SELECT uid,name,email_id,phone_no, role, create_time FROM users WHERE uid = '${req.auth.uid}'`;

  db.query(sql, (err, result) => {
    if (err) {
      send400(err, req, res, err.sqlMessage);
      return;
    }

    send200(req, res, result[0]);
  });
};

exports.updateUser = (req, res) => {
  console.log(req.body);
  const { name, phone_no, email_id } = req.body;
  //check to see update is allowed
  let sql = `UPDATE users SET name='${name}', phone_no='${phone_no}', email_id = '${email_id}'
             WHERE uid='${req.auth.uid}'`;

  db.query(sql, (err, result) => {
    if (err) return send400(err, req, res, err.sqlMessage);

    send200(req, res, { message: "User Updated" });
  });
};

exports.joinGroup = (req, res) => {
  const uid = uuid.generate().substr(0, 8);
  let sql = `INSERT INTO user_group_mapping (uid, user_id, group_id) 
             VALUES ('${uid}', '${req.auth.uid}', '${req.body.group_id}');`;
  sql += ` UPDATE groups SET user_count = user_count + 1 WHERE uid = '${req.body.group_id}'`;

  db.query(sql, (err, result) => {
    if (err) return send400(err, req, res, err.sqlMessage);
    send200(req, res, { message: "User added to group" });
  });
};

exports.leaveGroup = (req, res) => {
  let sql = `DELETE FROM user_group_mapping WHERE group_id = '${req.body.group_id}' AND user_id = '${req.auth.uid}'`;
  db.query(sql, (err, result) => {
    if (err) return send400(err, req, res, err.sqlMessage);
    send200(req, res, { message: "User removed from group" });
  });
};

exports.getAllGroups = (req, res) => {
  let sql = `SELECT uid,name,user_count FROM groups`;
  db.query(sql, (err, result) => {
    if (err) return send400(err, req, res, err.sqlMessage);
    send200(req, res, result);
  });
};

exports.getAllGroupsJoined = (req, res) => {
  console.log(req.auth.uid);
  let sql = `SELECT DISTINCT group_id , name , user_count 
             FROM user_group_mapping 
             JOIN groups ON group_id = groups.uid  
             WHERE user_id = '${req.auth.uid}'`;

  db.query(sql, (err, result) => {
    if (err) return send400(err, req, res, err.sqlMessage);
    send200(req, res, result);
  });
};

exports.chatImageUpload = (req, res) => {
  const unique = uuid.generate().substr(0, 5);
  let image = req.files.image;
  let name = `user-${"assa"}-$group-${req.body.group_id}.-${unique}.jpeg`;
  let path = `images/chat/groups/${name}`;

  if (!image) {
    send500(err, req, res, "Could not find image");
    return;
  }

  sharp(image.data)
    .jpeg()
    .toFile(`${__dirname}/../../${path}`, (err) => {
      if (err) {
        send400(err, req, res, "Could not upload image");
        return;
      }

      send200(req, res, { imageUrl: path });
    });
};

exports.chatImageAccessGroups = (req, res) => {
  let name = req.swagger.params.name.value;
  res.sendFile(name, { root: `images/chat/groups/` });
};

exports.getUsersForGroup = (req, res) => {
  const group_id = req.swagger.params.group_id.value;
  let sql = `SELECT users.uid, users.name, users.phone_no 
             FROM user_group_mapping 
             JOIN users ON user_group_mapping.user_id = users.uid
             WHERE group_id = '${group_id}' `;

  db.query(sql, (err, result) => {
    if (err) return send400(err, req, res, err.sqlMessage);
    send200(req, res, result);
  });
};

exports.getLatestRecommendedProducts = (req, res) => {
  const group_id = req.swagger.params.group_id.value;
  const dbMongo = getDbMongo();
  dbMongo
    .collection("recommended_products")
    .find({ group_id: group_id })
    .sort({ createTime: -1 })
    .limit(5)
    .toArray((err, result) => {
      if (err) return send400(err, req, res, "Could not get products");

      return send200(req, res, result);
    });
};

exports.getChatsForGroup = (req, res) => {
  const group_id = req.swagger.params.group_id.value;
  const dbMongo = getDbMongo();
  dbMongo
    .collection("group_chats")
    .find({ group_id: group_id })
    .sort({ createTime: -1 })
    .toArray((err, result) => {
      if (err) return send400(err, req, res, "Could not get products");
      return send200(req, res, result);
    });
};

exports.updateLatestProductRecommended = (req, res) => {
  const insertData = { ...req.body, createTime: getCurrTime(true) };
  if (insertData.produrl[0] === "/") {
    insertData.produrl = "https://www.bajajfinservmarkets.in" + insertData.produrl;
  }

  console.log(insertData);
  getDbMongo()
    .collection("recommended_products")
    .insertOne(insertData, (err, result) => {
      if (err) send400(req, res, "Coult not");
      else {
        const chat = {
          group_id: insertData.group_id,
          message: {
            _id: result.insertedId,
            text: `${insertData.prodname}::${insertData.produrl}`,
            createdAt: new Date(),
            image: insertData.prodimageurl,
            user: {
              _id: "sytemid",
              name: "Recommended Product",
              avatar:
                "https://yt3.ggpht.com/ytc/AKedOLT9ZRKPvzhhrH0KH0ohT_7F0Bvpe4Rv7jY8extSWQ=s900-c-k-c0x00ffffff-no-rj",
            },
          },
        };

        req.socketObject.emit("RECOMMEND_PRODUCT", { ...insertData, _id: result.insertedId });
        req.socketObject.emit("GRP_MSG", chat);
        addChatToDatabase(chat);
        send200(req, res, { message: "Recommeneded" });
      }
    });
};

exports.favoriteProduct = (req, res) => {
  const user_id = req.auth.uid;
  const prod_id = req.body.product_id;
  const uid = uuid.generate().substr(0, 8);

  console.log(req.body);

  let sql = `INSERT INTO user_prod_mapping (uid, user_id, prod_id) VALUES ('${uid}', '${user_id}', '${prod_id}')`;
  db.query(sql, (err, result) => {
    if (err) return send400(err, req, res, err.sqlMessage);

    return send200(req, res, { result: "Added to favorites" });
  });
};

exports.getFavorites = (req, res) => {
  let sql = `SELECT uid, prod_id FROM user_prod_mapping WHERE user_id='${req.auth.uid}'`;
  db.query(sql, (err, result) => {
    if (err) return send400(err, req, res, err.sqlMessage);

    let arrProdIds = result.map((item) => ObjectId(item.prod_id));
    getDbMongo()
      .collection("recommended_products")
      .find({ _id: { $in: arrProdIds } })
      .toArray((err, result) => {
        if (err) return send400(err, req, res, "MongoError");
        return send200(req, res, result);
      });
  });
};

exports.addForumPost = (req, res) => {
  const insertData = {
    title: req.body.title,
    body: req.body.body,
    topic: req.body.topic,
    user_id: req.auth.uid,
    comments: [],
    upvotes: [],
    downvotes: [],
  };

  getDbMongo()
    .collection("forum_posts")
    .insertOne(insertData, (err, result) => {
      if (err) return send400(err, req, res, "Could not insert data");
      return send200(req, res, { newUid: result.insertedId, message: "Post Added" });
    });
};

exports.getAllFeeds = (req, res) => {
  getDbMongo()
    .collection("forum_posts")
    .find({})
    .toArray((err, result) => {
      if (err) return send400(err, req, res, "Could not get data");
      return send200(req, res, result);
    });
};

exports.voteFeed = (req, res) => {
  const type = req.body.type;
  const findData = { _id: ObjectId(req.body.forum_id) };
  const updateData = {};
  switch (type) {
    case "up":
      updateData.$addToSet = { upvotes: req.auth.uid };
      break;
    case "down":
      updateData.$addToSet = { downvotes: req.auth.uid };
  }

  console.log(updateData);
  console.log(findData);

  getDbMongo()
    .collection("forum_posts")
    .updateOne(findData, updateData, (err, result) => {
      if (err) return send400(err, res, res, "Could not");

      console.log(result);
      send200(req, res, { result: "done" });
    });
};

exports.commentFeed = (req, res) => {
  const findData = { _id: ObjectId(req.body.forum_id) };
  const comment = {
    comment_body: req.body.comment_body,
    createTime: getCurrTime(true),
    user_id: req.auth.uid,
    user_name: req.body.user_name,
  };
  const updateData = { $push: { comments: comment } };
  getDbMongo()
    .collection("forum_posts")
    .updateOne(findData, updateData, (err, result) => {
      if (err) return send400(err, res, res, "Could not");

      console.log(result);
      send200(req, res, { result: "done" });
    });
};

exports.addFriend = (req, res) => {
  const findData = { user_id: req.auth.uid };
  const updateData = {
    $addToSet: { friend_ids_list: req.body.user_id, friend_name_list: req.body.user_name },
  };

  getDbMongo()
    .collection("friends")
    .updateOne(findData, updateData, { upsert: true }, (err, result) => {
      if (err) return send400(err, res, res, "Could not");
      send200(req, res, { result: "done" });
    });
};

exports.getFriends = (req, res) => {
  getDbMongo()
    .collection("friends")
    .find({ user_id: req.auth.uid })
    .toArray((err, result) => {
      if (err) return send400(err, res, res, "Could not");
      send200(req, res, result);
    });
};

exports.uploadForumImage = (req, res) => {
  const unique = uuid.generate().substr(0, 5);
  let image = req.files.image;
  let name = `forum_${req.body.forum_id}_${unique}.jpeg`;
  let path = `images/forum/${name}`;

  if (!image) {
    send500(err, req, res, "Could not find image");
    return;
  }

  sharp(image.data)
    .jpeg()
    .toFile(`${__dirname}/../../${path}`, (err) => {
      if (err) {
        send400(err, req, res, "Could not upload image");
        return;
      }

      getDbMongo()
        .collection("forum_posts")
        .updateOne(
          { _id: ObjectId(req.body.forum_id) },
          { $set: { imageUrl: path } },
          (err, result) => {
            if (err) return send400(err, req, res, "Could not");
            return send200(req, res, { imageUrl: path, message: "Image Uploaded" });
          }
        );
    });
};

exports.forumImageAccess = (req, res) => {
  let name = req.swagger.params.name.value;
  res.sendFile(name, { root: `images/forum/` });
};
