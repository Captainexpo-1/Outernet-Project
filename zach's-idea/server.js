const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { error } = require('console');
dotenv.config();

const app = express();
const port = process.env.PORT;

// Get API key from .env
const apiKey = process.env.OPENAI_API_KEY;

// Sample leaderboard data (for demonstration purposes)
let leaderboardData = [
    { name: 'Bart Simpson', score: 999 },
    { name: 'Jimmy Neutron', score: 1258 },
    // Add more players and their scores as needed
];

// Set the public folder as a static directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the root URL
app.get('/', (req, res) => {
    // Send the index.html file when a request is made to the root URL
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to get the leaderboard data
app.get('/leaderboard/get', (req, res) => {
    // Sort the leaderboard data based on scores (descending order)
    leaderboardData.sort((a, b) => b.score - a.score);
    res.json(leaderboardData);
});
app.get('/leaderboard/add', (req, res) => {
    const { name, score } = req.query;
    if (name && score) {
        leaderboardData.push({ name, score: parseInt(score) });
        res.status(201).json({ message: 'Data added to leaderboard successfully!' });
    } else {
        res.status(400).json({ error: 'Invalid request. Please provide a valid name and score.' });
    }
});


app.get('/get-key', (req, res) => {
    // Get API key (this is a very bad security vulnerability, but this is a prototype so YOLO)
    res.send(apiKey);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
