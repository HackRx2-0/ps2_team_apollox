exports.handleError = (err, res) => {
  switch (err.code) {
    case "SCHEMA_VALIDATION_FAILED":
      res.status(400).send({
        message: "Failed Parameter Verfication",
        errors: pushError(err),
      });
      break;

    case "REQUIRED":
      res.status(400).send({
        message: "Failed Parameter Verfication",
        errors: [
          {
            code: "REQUIRED",
            message: "Missing a required parameter name",
            param: err.paramName,
          },
        ],
      });
      break;

    case "INVALID_TYPE":
      res.status(400).send({
        message: "Failed Parameter Verfication",
        errors: [
          {
            code: "REQUIRED",
            message: "Parameter type mismatch",
            param: err.paramName,
          },
        ],
      });
      break;

    default:
      res.status(400).send({
        message: "Failed Parameter Verfication",
        error: err,
      });
      break;
  }
};

function pushError(err) {
  return err.results.errors.map((error) => {
    let errObj = {
      code: error.code,
      message: error.message,
    };
    if (error.code === "INVALID_TYPE") errObj.param = error.path[0];
    return errObj;
  });
}
