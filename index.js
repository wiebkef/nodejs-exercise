const express = require("express");
require("dotenv/config");
const app = express();
const PORT = process.env.PORT || 4001;
const { Pool } = require("pg");

const cors = require("cors");

//const pool = require("./poolConnection.js");

app.use(express.json());
app.use(cors());

const usersRouter = require("./users.js");
app.use("/api/users", usersRouter);

const ordersRouter = require("./orders.js");
app.use("/api/orders", ordersRouter);

app.get("/", (req, res, next) => {
  res.send("Such a beautiful online shop simulation.");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
