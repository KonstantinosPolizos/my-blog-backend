const express = require("express");

const app = express();

app.use(express.json());
app.use("/users", require("../routes/userRoutes"));
app.use("/posts", require("../routes/postRoutes"));

app.listen("3000", () => {
  console.log(`Server is running at 3000 port`);
});
