const express = require("express");
const sqlite3 = require("sqlite3");
const app = express();
const port = 3000;

const db = new sqlite3.Database("./todos.db");

db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, item TEXT, listId INTEGER, FOREIGN KEY(listID) REFERENCES lists(id))"
  );
  db.run(
    "CREATE TABLE IF NOT EXISTS lists (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)"
  );
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  db.all("SELECT id, name FROM lists", [], (err, rows) => {
    res.render("lists", { title: "Home", tempStorage: rows });
  });
});

app.get("/list/:listId", (req, res) => {
  const listId = req.params.listId;
  db.all(
    "SELECT id, item FROM todos WHERE listId = ?",
    [listId],
    (err, rows) => {
      res.render("todos", { title: "List", tempStorage: rows || [], listId });
    }
  );
});

app.post("/list/:listId/create-todo", (req, res) => {
  const todo = req.body.data;
  const listId = req.params.listId;
  db.run("INSERT INTO todos (item, listId) VALUES (?,?)", [todo, listId]);
  res.redirect("/");
});

app.post("/create-list", (req, res) => {
  const list = req.body.data;
  db.run("INSERT INTO lists (name) VALUES (?)", [list]);
  res.redirect("/");
});

app.post("/list/:listId/delete-todo", (req, res) => {
  const id = req.body.id;
  db.run("DELETE FROM todos WHERE id = ?", [id], (err) => {
    res.redirect("/");
  });
});

app.post("/delete-list", (req, res) => {
  const id = req.body.id;
  db.run("DELETE FROM lists WHERE id = ?", [id], (err) => {
    res.redirect("/");
  });
});

app.post("/edit-todo", (req, res) => {
  const id = req.body.id;
  const item = req.body.item;
  db.run("UPDATE todos SET item = ? WHERE id = ?", [item, id], (err) => {
    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
