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

module.exports = usersRouter;
