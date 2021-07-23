"use strict";

const fs = require("fs");

const express = require("express");
const cors = require("cors");

const fileUpload = require("express-fileupload");

const swaggerTools = require("swagger-tools");
const yaml = require("js-yaml");

const config = require("./config/config.json");
const swagger = fs.readFileSync("./api/swagger/swagger.yaml", "utf8");

const { handleError } = require("./api/helpers/error");
const auth = require("./api/helpers/auth");

const app = express();
const swaggerConfig = yaml.load(swagger);

app.use(cors());
app.use(fileUpload());

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

  app.listen(port, (err) => {
    if (err) throw err;
    console.log(`Started server on port: ${port}`);
  });
});
