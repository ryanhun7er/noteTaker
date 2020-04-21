const express = require("express");
const path = require("path");
const fs = require("fs");

// ==============================================================================
// EXPRESS CONFIGURATION
// This sets up the basic properties for our express server
// ==============================================================================

// Tells node that we are creating an "express" server
const app = express();

// Sets an initial port. We"ll use this later in our listener
const PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const notes = JSON.parse(
  fs.readFileSync(path.join(__dirname, "/db/db.json"), (err, data) => {
      if (err) throw err;
  })
  );
  
const notesUpdate = notes => {
  fs.writeFileSync(
    path.join(__dirname, "/db/db.json"),
    JSON.stringify(notes),
    err => {
    if (err) throw err;
    }
);
};

// use app.get for linking html js and css files

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
  });
  
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
  });

app.get("/assets/css/styles.css", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/assets/css/styles.css"));
  });
  
app.get("/assets/js/index.js", function(req, res) {
  res.sendFile(path.join(__dirname, "/public/assets/js/index.js"));
  });

app.get("/api/notes", function(req, res) {
  return res.json(notes);
  });  







// Sets up listener port
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
  });