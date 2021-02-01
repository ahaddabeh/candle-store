const path = require("path")
// Making environment variables available to all modules imported below
require("dotenv").config({
    path: path.resolve(path.join(__dirname, "../.env"))
});
const express = require("express");
const cors = require("cors");

const app = express();

const createError = require("http-errors");

express.response.sendHttpSuccess = function (results, message = "OK", statusCode = 200) {
    // Custom success response
    return this.contentType("application/json").status(statusCode).send({ message, code: statusCode, error: false, results });
}
express.response.sendHttpError = function (statusCode, message, error = {}, properties = {}) {
    // Custom success response
    const errorDetails = {
        name: error.name,
        message: error.message,
        stack: error.stack
    }
    return this.contentType("application/json").status(statusCode).send({
        message,
        code: statusCode,
        error: true,
        errorMessage: createError(statusCode).message,
        errorDetails,
        properties
    });
}

// validation error response used across api routes
express.response.sendValidationError = function (errors, message = "Validation Errors", statusCode = 422) {
    return this.contentType('application/json').status(statusCode).send({ message, code: statusCode, error: true, errorMessage: createError(statusCode).message, errors });
};

// Setting up global middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))



module.exports = app;