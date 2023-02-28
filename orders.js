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

ordersRouter.get("/:id", (req, res) => {
  const id = req.params.id;
  pool
    .query("SELECT * FROM ORDERS WHERE id=$1;", [id])
    .then((data) => {
      if (data.rowCount === 0) {
        res.status(404).json({ message: "Order not found" });
      } else {
        res.json(data.rows[0]);
      }
    })
    .catch((e) => {
      res
        .status(500)
        .json({ message: "An error occured while fetching order." });
    });
});

module.exports = ordersRouter;
