"use strict";

let response = {};

const appendExtraParams = (resObject, extraParams = null) => {
  if (extraParams)
    Object.keys(extraParams).map((x) => (resObject[x] = extraParams[x]));
};

response.successResponse = (res, extraParams = null) => {
  const resObject = {
    isSuccess: true,
    status: 202,
  };
  appendExtraParams(resObject, extraParams);
  return res.status(202).json(resObject);
};

response. badRequestResponse = (res, extraParams = null) => {
  const resObject = {
    isSuccess: false,
    status: 400,
  };
  appendExtraParams(resObject, extraParams);
  return res.status(400).json(resObject);
};

response.notFoundResponse = (res, extraParams = null) => {
  const resObject = {
    isSuccess: false,
    statusCode: 404,
  };
  appendExtraParams(resObject, extraParams);
  return res.status(404).json(resObject);
};

response.errorResponse = (error, res) => {
  return res.status(505).json({
    isSuccess: false,
    status: 505,
    message: error.message,
  });
};
response.validarionerrorResponse = (res, error) => {
  return res.status(403).json({
    success: false,
    status: 403,
    message: error.message,
  });
};

module.exports = response;