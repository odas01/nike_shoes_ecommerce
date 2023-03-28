const responseWithData = (res, statusCode, data) =>
  res.status(statusCode).json(data);

const error = (res) =>
  responseWithData(res, 500, {
    status: 500,
    msg: "Oops! Something worng!",
  });

const badrequest = (res, msg) =>
  responseWithData(res, 400, {
    status: 400,
    msg,
  });

const ok = (res, data) => responseWithData(res, 200, data);

const created = (res, data) => responseWithData(res, 201, data);

const unauthorize = (res) =>
  responseWithData(res, 401, {
    status: 401,
    msg: "Unathorized",
  });

const notfound = (res) =>
  responseWithData(res, 404, {
    status: 404,
    msg: "Resource not found",
  });

export default {
  error,
  badrequest,
  ok,
  created,
  unauthorize,
  notfound,
};
