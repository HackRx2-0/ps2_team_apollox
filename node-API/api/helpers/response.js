exports.send400 = (err, req, res, message, statusCode = 400) => {
  if (err !== null) console.log(err);
  return res.status(statusCode).send({ message });
};

exports.send500 = (err, req, res, message, statusCode = 500) => {
  if (err !== null) console.log(err);
  return res.status(statusCode).send({ message });
};

exports.send200 = (req, res, response, statusCode = 200) => {
  return res.status(statusCode).send(response);
};

exports.escapeSlashes = (str) => {
  return str.replace(/\\/g, "\\\\").replace(/\$/g, "\\$").replace(/'/g, "\\'").replace(/"/g, '\\"');
};
