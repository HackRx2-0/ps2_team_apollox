"use strict";

const fs = require("fs");
const http = require("http");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const moment = require("moment");
const swaggerTools = require("swagger-tools");
const yaml = require("js-yaml");
const socketIo = require("socket.io");

const config = require("./config/config.json");
const initDb = require("./api/helpers/dbMongo").initDb;
const auth = require("./api/helpers/auth");
const handleError = require("./api/helpers/error").handleError;
const swagger = fs.readFileSync("./api/swagger/swagger.yaml", "utf8");

const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer, {});

const swaggerConfig = yaml.load(swagger);

app.use(cors());
app.use(fileUpload());

app.get("/", (req, res) => {
  res.sendFile(`index.html`, { root: "./" });
});

function catchError(err, req, res, next) {
  console.log(err.code);
  handleError(err, res);
  // exit from here, no need to go inside the handler
}

// SOCKET --------------------------------------------------------------------------------------------------------------------
// START---------------------------------------------------------------------------------------------------------------------

const userSocketMap = {};
const userRoomMap = {};

// ********* auth middleware for new sockets
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      // If token is missing or some shit
      const err = new Error("not authorized");
      err.data = { message: "Auth error. Recheck Token" };
      next(err);
    } else {
      // If token present
      const userId = decodedToken.uid;
      const roomname = `PVT__${userId}`;

      // Add the entries for later use , can use redis for this
      userSocketMap[userId] = socket.id;
      userRoomMap[userId] = roomname;
      socket.join(roomname);

      // console.log({ userSocketMap, userRoomMap });

      //Add the roomId to the socket object
      socket.user = {
        ...decodedToken,
        privateRoom: userRoomMap[userId],
      };

      next();
    }
  } catch (err) {
    console.log(err);
    next(new Error("Error Occured"));
  }
});

io.on("connection", (socket) => {
  console.log("client connected - " + socket.id);

  // Send private message
  socket.on("PVT_MSG", (payload, cb) => {
    const chat = {
      from: socket.user.uid,
      to: payload.to,
      message: payload.message,
      create_time: getCurrTime(true),
    };
    console.log(chat);
    socket.to(userRoomMap[payload.to]).emit("PVT_MSG", chat);
    cb({ status: "OK" });
  });

  // Join a room
  socket.on("JOIN_ROOM", (payload, cb) => {
    let sqlQuery = `SELECT uid FROM user_group_mapping WHERE user_id = '${socket.user.uid}' AND group_id = '${payload.group_id}'`;
    db.query(sqlQuery, (err, result) => {
      if (err) console.log(err.sqlMessage);
      else {
        if (result.length) {
          socket.join(`ROOM_${payload.group_id}`);
          cb({ status: "OK" });

          console.log("user in group");
          const rooms = io.of("/").adapter.rooms;
          console.log({ rooms });
        } else {
          cb({ status: "NOK" });
          console.log("user not in group");
        }
      }
    });
  });

  socket.on("GRP_MSG", (payload, cb) => {
    // const chat = {
    //   messageUid: payload._id,
    //   text: payload.text,
    // };
    const chat = {
      from: socket.user.uid,
      group_id: payload.group_id,
      message: payload.message,
      createdAt: getCurrTime(true),
    };

    console.log(chat);
    // addChatToDatabase(chat);
    socket.to(`ROOM_${payload.group_id}`).emit("GRP_MSG", chat);
    cb({
      status: "OK",
    });
  });

  // When socket disconnects
  socket.on("disconnect", (reason) => {
    console.log(`socket disconnected - ${reason}`);
    if (socket.user) delete userSocketMap[socket.user.uid];
  });
});

// SOCKET ------------------------------------------------------------------------------------------------------------------
// END-----------------------------------------------------------------------------------------------------------------------

swaggerTools.initializeMiddleware(swaggerConfig, (middleware) => {
  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  // Authentication
  app.use(
    middleware.swaggerSecurity({
      Bearer: auth.verifyToken,
    })
  );

  // Validate Swagger requests
  app.use(
    middleware.swaggerValidator({
      validateResponse: false,
    })
  );
  app.use(catchError);

  //Forward validated request for routing
  const routerConfig = {
    controllers: "./api/controllers",
    useStubs: false,
  };
  app.use(middleware.swaggerRouter(routerConfig));

  const port = config.port;
  httpServer.listen(port, (error) => {
    if (error) throw error;
    console.log("Server Running on port " + port);
    // initDb((err) => {
    //   if (err) throw err;
    // });
  });
});

// 20.204.23.216
