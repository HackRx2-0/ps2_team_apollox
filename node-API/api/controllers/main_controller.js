"use strict";

const db = require("../helpers/db");
const getDbMongo = require("../helpers/dbMongo").getDbMongo;

const moment = require("moment");
const uuid = require("short-uuid");
const auth = require("../helpers/auth");

const firebaseAdmin = require("firebase-admin");
const firebaseKey = require("../../config/firebase_key.json");
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseKey),
});

const { send200, send400 } = require("../helpers/response");

function getCurrTime() {
  return moment().format("YYYY-MM-DD hh:mm:ss");
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
            return send200(req, res, {
              uid: uid,
              name: null,
              email_id: null,
              phone_no: phoneNo,
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
            return send200(req, res, {
              uid: uid,
              name: null,
              phone_no: null,
              email_id: emailId,
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
