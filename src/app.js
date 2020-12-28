const path = require("path")
// Making environment variables available to all modules imported below
require("dotenv").config({
    path: path.resolve(path.join(__dirname, "../.env"))
});
const express = require("express");
const cors = require("cors");

const app = express();
// Setting up global middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

module.exports = app;