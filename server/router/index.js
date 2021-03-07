const express = require("express");
const router = express.Router();

const download = require("./youtube-download");

router.use("/download", download.router);

// return the router
module.exports = { router };
