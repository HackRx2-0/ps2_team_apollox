"use strict";

const jwt = require("jsonwebtoken");
const sharedSecret = require("../../config/config.json").secretToken;

exports.verifyToken = function (req, authOrSecDef, token, callback) {
  function sendError() {
    return req.res.status(403).json({
      message: "Error: Access Denied",
    });
  }

  let currentScopes = req.swagger.operation["x-security-scopes"];
  if (token && token.indexOf("Bearer ") == 0) {
    var tokenString = token.split(" ")[1];
    jwt.verify(tokenString, sharedSecret, function (verificationError, decodedToken) {
      if (
        verificationError == null &&
        Array.isArray(currentScopes) &&
        decodedToken &&
        decodedToken.role
      ) {
        let roleMatch = currentScopes.indexOf(decodedToken.role) !== -1;
        if (roleMatch) {
          req.auth = decodedToken;
          req.auth.tokenValue = tokenString;
          return callback(null);
        } else {
          console.log("role no match");
          return callback(sendError());
        }
      } else {
        console.log("verification errro");
        console.log(verificationError);
        return callback(sendError());
      }
    });
  } else {
    return callback(sendError());
  }
};

exports.issueToken = function (user) {
  var token = jwt.sign({ ...user, iss: "Cure-MajorProject" }, sharedSecret, {
    expiresIn: 1 * 60 * 60 * 24,
  });
  return token;
};
