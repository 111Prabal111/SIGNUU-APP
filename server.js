const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the signup page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html');
});

// Handle signup form submission
app.post('/signup', (req, res) => {
    const userData = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    };

    // Save the user data to a file
    fs.appendFile('users.txt', JSON.stringify(userData) + '\n', (err) => {
        if (err) {
            return res.status(500).send('An error occurred while saving the data.');
        }
        res.send('<h2>Signup successful!</h2><p><a href="/login">Click here to login</a></p>');
    });
});

// Serve the login page
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// Handle login form submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Read users.txt file
    fs.readFile('users.txt', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('An error occurred while reading the data.');
        }

        // Split the file content into lines
        const users = data.split('\n').filter(line => line.trim() !== '');

        // Check if the user exists
        let userFound = false;
        for (let user of users) {
            const parsedUser = JSON.parse(user);
            if (parsedUser.username === username && parsedUser.password === password) {
                userFound = true;
                break;
            }
        }

        if (userFound) {
            res.send(`<h2>Login successful!</h2><p>Welcome, ${username}!</p>`);
        } else {
            res.send('<h2>Login failed</h2><p>Invalid username or password. <a href="/login">Try again</a></p>');
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
