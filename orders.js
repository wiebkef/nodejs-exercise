const express = require("express");
const ordersRouter = express.Router();
const pool = require("./poolConnection.js");
const cors = require("cors");

ordersRouter.use(express.json());
ordersRouter.use(cors());

ordersRouter.get("/", (req, res) => {
  pool
    .query("SELECT * FROM ORDERS;")
    .then((data) => {
      res.json(data.rows);
    })
    .catch((e) => {
      res.status(500).json({ message: e.message });
    });
});

module.exports = ordersRouter;
