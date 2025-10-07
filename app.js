const express = require("express");
const sqlite3 = require("sqlite3");
const app = express();
const port = 3000;

const db = new sqlite3.Database("./todos.db");

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, item TEXT)"
  );
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  db.all("SELECT id, item FROM todos", [], (err, rows) => {
    res.render("index", { title: "Home", tempStorage: rows });
  });
});

app.post("/submit", (req, res) => {
  const todo = req.body.data;
  db.run("INSERT INTO todos (item) VALUES (?)", [todo]);
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const id = req.body.id;
  db.run("DELETE FROM todos WHERE id = ?", [id], (err) => {
    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
