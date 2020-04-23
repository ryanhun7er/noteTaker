const express = require("express");
const path = require("path");
const fs = require("fs");

const db_dir = path.resolve(__dirname, "db");
const notesArray = path.join(db_dir, "db.json");
let db = require("./db/db.json");
// Tells node that we are creating an "express" server

const app = express();

// Sets an initial port

const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); 

//const for reading and writing file sync

const notes = JSON.parse(
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
  let id = notes.length;

  console.log(addNote);

  addNote.id = id + 1;
  notes.push(addNote);
  updateNote(notes);
  return res.json(notes);
  
});

// process for deleting notes

app.delete("/api/notes/:id", (req, res) => {

  let noteID = req.params.id;
 
  for(let i = 0; i < notes.length; i++) {
    if (noteID === notes[i].id) {
      notes.splice(i,1);
      fs.writeFileSync(notesArray, JSON.stringify(notes), (err) => {
        if (err) throw err;
      });
      return res.json(notes);
         
    }
  } 
  

});



// Sets up listener port
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
  });