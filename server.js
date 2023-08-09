

const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { default: axios } = require('axios');
dotenv.config();

const app = express();
const port = process.env.PORT;

// Get API key from .env
const apiKey = process.env.OPENAI_API_KEY;

// Sample leaderboard data (for demonstration purposes)
let leaderboardData = [
    {name: "Sam (@sampoder)", score: 15},
    {name: "Ian", score:  24},
    {name: "Zach Latta (@zrl)", score:  90},
    {name: "Fayd", score:  98},
    {name: "dinobox", score:  122},
    {name: "Alex", score:  256},
    {name: "Swarnya", score:  283},
    {name: "fatimah", score:  355}
];
// Set the public folder as a static directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for the root URL
app.get('/', (req, res) => {
    // Send the index.html file when a request is made to the root URL
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/leaderboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'leaderboard.html'));
})
app.get('/generate-text', async (req, res) => {
    try {
        // Parse query
        const { previousMessages } = req.query;

        // Convert the stringified JSON to an actual array of message objects
        const messages = JSON.parse(previousMessages);

        // Get the completion
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: messages,
                temperature: 0.8,
                max_tokens: 50,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
            }
        );

        // Send back the completion
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong. ' + error.message });
    }
});
app.get('/leaderboard/get', (req, res) => {
    // Sort the leaderboard data based on scores (descending order)
    leaderboardData.sort((a, b) => b.score - a.score);
    res.json(leaderboardData);
});
app.get('/leaderboard/remove', (req, res) => {
    // Remove leaderboard data whose name = to the request query
    const { name } = req.query//.replace("%20", " ");
    if (name) {
        leaderboardData = leaderboardData.filter((data)=> data.name !== name);
        res.status(200).json({ message: 'Data removed from leaderboard successfully!' });
    }

    else{
        res.status(400).json({ error: 'Invalid request. Please provide a valid name.' });
    }
    //example curl command to remove data
    // curl -X GET "http://localhost:3000/leaderboard/remove?name=Sam%20(%40sampoder)"
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
