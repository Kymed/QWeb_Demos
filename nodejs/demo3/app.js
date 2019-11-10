const express = require('express');

const app = express();

// Set the view engine:
app.set("view engine", "ejs");

// Rendering Variables
app.get('/', (req, res) => {
    res.render('home', {
        title: "Node.js Demo 3",
        author: "Kyle Meade"
    });
});

// Rendering Conditionally
app.get('/loggedin', (req, res) => {
    res.render('condition', {
        logged: false
    });
});

// Rendering Dynamic Lists
app.get('/techstack', (req, res) => {
    res.render('list', {
        stack: ["html", "css", "javascript", "node.js", "express.js", "mongodb", "react"]
    });
});


app.listen(3000, () => console.log(`Server is listening`));