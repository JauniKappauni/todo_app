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
  db.all("SELECT item FROM todos", [], (err, rows) => {
    const tempStorage = rows.map((row) => row.item);
    res.render("index", { title: "Home", tempStorage: tempStorage });
  });
});

app.post("/submit", (req, res) => {
  const todo = req.body.data;
  db.run("INSERT INTO todos (item) VALUES (?)", [todo]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
