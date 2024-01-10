const express = require("express");

const chartRouter = express.Router();

const {
  getPantSizeChart,
  getShirtSizeChart,
  getTeeSizeChart,
} = require("../controller/chartController");

chartRouter.route("/pant").get(getPantSizeChart);

chartRouter.route("/shirt").get(getShirtSizeChart);

chartRouter.route("/tee").get(getTeeSizeChart);

module.exports = chartRouter;
