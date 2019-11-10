const express = require('express');
const mongoose = require('mongoose');

const app = express();

// This is required to parse POST request data into json
app.use(express.json({
    extended: false
}));

// Database URI
const uri = "";
// Enter your own MongoDB Atlas URI in here!!!


// Async await function to connect to the database
const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: true,
            useUnifiedTopology: true
        });

        console.log("connected to the database");
    } catch (err) {
        console.log("Could not connect to the database");
        console.error(err.message);
        process.exit(1);
    }
}

// Connect to the database
if (uri !== "") {
    // Entry point
    app.get('/', (req, res) => {
        res.json({msg: "Welcome to question forum"});
    });

    connectDB();

    // Bring in endpoints from files
    app.use('/api/user', require('./routes/user'));
    app.use('/api/post', require('./routes/post'));
} else {
    app.all('/*', (req, res) => {
        res.send("Database not connected. Enter a MongoDB Uri into App.js to use!");
    });
}



app.listen(3000, () => console.log(`Server is listening`));