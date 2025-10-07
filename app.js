const express = require("express");
const app = express();
const port = 3000;

const tempStorage = [];

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index", { title: "Home", tempStorage: tempStorage });
});

app.post("/submit", (req, res) => {
  const todo = req.body.data;
  tempStorage.push(todo);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
