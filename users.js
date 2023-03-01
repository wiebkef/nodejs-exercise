const express = require("express");
const usersRouter = express.Router();
const pool = require("./poolConnection.js");
const cors = require("cors");

usersRouter.use(express.json());
usersRouter.use(cors());

usersRouter.get("/", (req, res) => {
  pool
    .query("SELECT * FROM USERS;")
    .then((data) => {
      res.json(data.rows);
    })
    .catch((e) => {
      res
        .status(500)
        .json({ message: "An error occured while fetching users." });
    });
});

usersRouter.get("/:id", (req, res) => {
  const id = req.params.id;
  pool
    .query("SELECT * FROM USERS WHERE id=$1;", [id])
    .then((data) => {
      if (data.rowCount === 0) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.json(data.rows[0]);
      }
    })
    .catch((e) => {
      res
        .status(500)
        .json({ message: "An error occured while fetching user." });
    });
});

usersRouter.post("/", (req, res) => {
  const { first_name, last_name, age, active } = req.body;
  pool
    .query(
      "INSERT INTO users (first_name, last_name, age, active) VALUES ($1, $2, $3, $4) RETURNING *;",
      [first_name, last_name, age, active]
    )
    .then((data) => {
      res.status(201).json(data.rows[0]);
    })
    .catch((e) => {
      res.status(500).json({ message: e.message });
    });
});

usersRouter.put("/:id", (req, res) => {
  const id = req.params.id;
  const { first_name, last_name, age, active } = req.body;
  pool
    .query(
      "UPDATE users SET first_name=$1, last_name=$2, age=$3, active=$4 WHERE id=$5 RETURNING *;",
      [first_name, last_name, age, active, id]
    )
    .then((data) => {
      res.status(201).json(data.rows[0]);
    })
    .catch((e) => {
      res.status(500).json({ message: e.message });
    });
});

usersRouter.delete("/:id", (req, res) => {
  const id = req.params.id;
  pool
    .query("DELETE FROM users WHERE id=$1 RETURNING *;", [id])
    .then((data) => {
      res.status(201).json(data.rows[0]);
    })
    .catch((e) => {
      res.status(500).json({ message: e.message });
    });
});

// gets all orders from one user
usersRouter.get("/:id/orders", (req, res) => {
  const id = req.params.id;
  pool
    .query(
      "SELECT orders.id as order_no, * FROM orders JOIN users ON users.id=user_id WHERE users.id = $1;",
      [id]
    )
    .then((data) => {
      if (data.rowCount === 0) {
        res.status(404).json({ message: "This user has no orders" });
      } else {
        res.json(data.rows);
      }
    })
    .catch((e) => {
      res.status(500).json({
        message: "An error occured while fetching orders of this user.",
      });
    });
});

// if a user has never ordered, they should be set as inactive
usersRouter.put("/:id/check-inactive", (req, res) => {
  const id = req.params.id;
  const { first_name, last_name, age } = req.body;

  pool
    .query(
      "select * from orders join users on users.id=user_id where users.id=$1",
      [id]
    )
    .then((data) => {
      if (data.rowCount === 0) {
        pool.query(
          "UPDATE users SET first_name=$1, last_name=$2, age=$3, active=false WHERE id=$4 RETURNING *;",
          [first_name, last_name, age, id]
        );
        res.status(200).json(data.rows[0]);
      } else {
        res.json(data.rows[0]);
      }
    })
    .catch((e) => {
      res.status(500).json({ message: e.message });
    });
});

module.exports = usersRouter;
