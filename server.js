const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const uuid = require("uuid/v4");
const writeFileAsync = util.promisify(fs.writeFile);

// Tells node that we are creating an "express" server


const app = express();

// Sets an initial port

const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); 

//const for reading and writing file sync

let notes = JSON.parse(
  fs.readFileSync(path.join(__dirname, "/db/db.json"), (err) => {
      if (err) throw err;
  })
  );
  
const updateNote = notes => {
  fs.writeFileSync(
    path.join(__dirname, "/db/db.json"),
    JSON.stringify(notes),
    err => {
    if (err) throw err;
  });
};

// use app.get for linking html js and css files

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
  });
  
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
  });

app.get("/api/notes", function(req, res) {
  return res.json(notes);
  });  

// process for posting notes

app.post("/api/notes", (req, res) => {
  
  let addNote = req.body;
  let id = uuid();

  addNote.id = `${id}`;
  notes.push(addNote);
  updateNote(notes);
  return res.json(notes);
  
});

// process for deleting notes

app.delete("/api/notes/:id", (req, res) => {

  let keptNotes = notes.filter(note => note.id !== req.params.id);

  notes = keptNotes;

  writeFileAsync("./db/db.json", JSON.stringify(notes))
  .then(() => {
    res.json(notes);
  }).catch((err) => console.log(err))
  });


// Sets up listener port
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
  });

  
