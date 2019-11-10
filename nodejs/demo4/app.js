const express = require('express');

const app = express();

// APi Hello World
app.get('/', (req, res) => {
    const data = {
        hello: 'world'
    }
    res.json(data);
});

// Redirect 
app.get('/locked', (req, res) => {
    res.redirect('/')
});

// Parameter variables
app.get('/account/:name', (req, res) => {
    let name = req.params.name;
    const account = {
        name
    }

    if (name === "kyle") {
        account.instructor = true;
    } else {
        account.instructor = false;
    }

    res.json(account);
});

// This is required to parse POST request data into json
app.use(express.json({
    extended: false
}));

// Post Request
app.post('/account', (req, res) => {
    const { name, password, password2 } = req.body;

    if (password !== password2) {
        return res.json({ msg: "password match fail" });
    }

    res.json({msg: `${name} account created` });
});

app.listen(3000, () => console.log(`Server is listening`));

