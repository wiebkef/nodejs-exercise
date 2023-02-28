const express = require("express");
require("dotenv/config");
const app = express();
const PORT = process.env.PORT || 4001;
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.ELEPHANT_SQL_CONNECTION_STRING,
});
const cors = require("cors");

//const pool = require("./poolConnection.js");

app.use(express.json());
app.use(cors());

/* const usersRouter = require("./users.js");
app.use("/users", usersRouter);
*/
const ordersRouter = require("./orders.js");
app.use("/orders", ordersRouter);

app.get("/", (req, res, next) => {
  res.send("Such a beautiful online shop simulation.");
});

app.get("/users", (req, res) => {
  pool
    .query("SELECT * FROM USERS;")
    .then((data) => {
      res.json(data.rows);
    })
    .catch((e) => {
      res.status(500).json({ message: e.message });
    });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
