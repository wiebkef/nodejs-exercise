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

ordersRouter.post("/", (req, res) => {
  const { price, date, user_id } = req.body;
  pool
    .query(
      "INSERT INTO orders (price, date, user_id ) VALUES ($1, $2, $3) RETURNING *;",
      [price, date, user_id]
    )
    .then((data) => {
      res.status(201).json(data.rows[0]);
    })
    .catch((e) => {
      res.status(500).json({ message: e.message });
    });
});

ordersRouter.put("/:id", (req, res) => {
  const id = req.params.id;
  const { price, date, user_id } = req.body;
  pool
    .query(
      "UPDATE orders SET price=$1, date=$2, user_id=$3 WHERE id=$id RETURNING *;",
      [price, date, user_id, id]
    )
    .then((data) => {
      res.status(201).json(data.rows[0]);
    })
    .catch((e) => {
      res.status(500).json({ message: e.message });
    });
});

module.exports = ordersRouter;
