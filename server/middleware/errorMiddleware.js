const ApiError = require("../utils/apiError");

const sendErrForDev = (err, res) =>
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
const sendErrForProd = (err, res) =>
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });

const handleJwtInvalidSignture = () =>
    new ApiError("Invalid token, please login again..", 401);

const handleJwtExpired = () =>
    new ApiError("Expired token, please login again..", 401);

// err => new ApiError("Invalid token, please login again..",
const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "development") {
        sendErrForDev(err, res);
    } else if (process.env.NODE_ENV === "production") {
        if (err.name === "JsonWebTokenError") err = handleJwtInvalidSignture();
        if (err.name === "TokenEpiredError") err = handleJwtExpired();

        sendErrForProd(err, res);
    }
};

module.exports = globalError;
