const express = require("express");
const app = express();

const PORT = process.env.PORT || 4001;

const usersRouter = require("./users.js");
app.use("/users", usersRouter);

const ordersRouter = require("./orders.js");
app.use("/orders", ordersRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
