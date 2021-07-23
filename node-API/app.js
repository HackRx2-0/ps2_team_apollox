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
