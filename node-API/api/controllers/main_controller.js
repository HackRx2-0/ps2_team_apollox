"use strict";

const db = require("../helpers/db");
const moment = require("moment");
const uuid = require("short-uuid");
const bcrypt = require("bcrypt");
const config = require("../../config/config.json");
const auth = require("../helpers/auth");

const { send200, send400, send500 } = require("../helpers/response");

function getCurrTime() {
  return moment(new Date()).utcOffset("+05:30").format("YYYY-MM-DD hh:mm:ss");
}

exports.createUser = (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = bcrypt.hashSync(password, config.saltRounds);
  const uid = uuid.generate().substr(0, 8);

  let sql = `INSERT INTO users (uid,name,email,password, role, create_time) 
              VALUES ('${uid}', '${name}', '${email}', '${hashedPassword}', '${role}', ${getCurrTime()}') `;

  db.query(sql, (err, result) => {
    if (err) {
      send400(err, req, res, err.sqlMessage);
      return;
    }

    send200(req, res, { message: "User Created", newUid: uid });
  });
};

exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  let sql = `SELECT uid,email,name,password,create_time,role FROM users WHERE email = '${email}'`;
  db.query(sql, (err, result) => {
    if (err) {
      send400(err, req, res, err.sqlMessage);
      return;
    }

    if (result.length === 0) {
      send400(null, req, res, "Wrong Email", 401);
      return;
    }

    const foundUser = result[0];
    let response = {};
    const isPasswordCorrect = bcrypt.compareSync(password, foundUser.password);

    if (!isPasswordCorrect) {
      send400(null, req, res, "Wrong Password", 401);
      return;
    }

    response = {
      uid: foundUser.uid,
      name: foundUser.name,
      email: foundUser.email,
      role: foundUser.role,
    };
    let token = auth.issueToken(response);
    response.token = token;

    send200(req, res, response);
  });
};

exports.getUser = (req, res) => {
  let sql = `SELECT uid, email,password,name,create_time,role FROM users WHERE uid = '${req.auth.uid}'`;

  db.query(sql, (err, result) => {
    if (err) {
      send400(err, req, res, err.sqlMessage);
      return;
    }

    send200(req, res, result[0]);
  });
};
