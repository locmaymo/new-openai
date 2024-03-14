require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');
const port = 7860;

app.use(cors({
    origin: 'https://venus.chub.ai',
}));
const bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

// Define your OpenAI API endpoint and authorization token
const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';
const openaiToken = process.env.OPENAI_API_KEY;

const password =  1;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Proxy endpoint to forward requests to OpenAI API
app.post('/v1/chat/completions', async (req, res) => {
    // if (req.headers.authorization !== `Bearer ${password}`) {
    //     return res.status(401).json({ error: 'Unauthorized' });
    // }
    try {
        // Forward the request to OpenAI API
        const response = await axios.post(openaiEndpoint, req.body, {
            headers: {
                'Authorization': `Bearer ${openaiToken}`,
                'Content-Type': 'application/json'
            },
            responseType: req.body.stream ? 'stream' : 'json'
        });

        if (req.body.stream === true) {
            response.data.on('data', (chunk) => {
                res.write(chunk);
            });
            response.data.on('end', () => {
                res.end();
            });
        } else {
            // Return the OpenAI API response to the client
            res.json(response.data);
        }
    } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error:', error.message);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.get('/v1/models', async (req, res) => {
    try {
        // Forward the request to OpenAI API
        const response = await axios.get('https://api.openai.com/v1/models', {
            headers: {
                'Authorization': `Bearer ${openaiToken}`,
                'Content-Type': 'application/json'
            }
        });

        // Return the OpenAI API response to the client
        res.json(response.data);
    } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error:', error.message);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// app.get('/v1/models', async (req, res) => {
//     res.json({
//         "object": "list",
//         "data": [
//             {
//                 "id": "gpt-claude-v1-100k",
//                 "object": "model",
//                 "created": 1677610602,
//                 "owned_by": "openai"
//             },
//             {
//                 "id": "gpt-3.5-turbo",
//                 "object": "model",
//                 "created": 1677610602,
//                 "owned_by": "openai"
//             },
//             {
//                 "id": "gpt-3.5-turbo-16k-0613",
//                 "object": "model",
//                 "created": 1685474247,
//                 "owned_by": "openai"
//             },
//             {
//                 "id": "gpt-3.5-turbo-0613",
//                 "object": "model",
//                 "created": 1686587434,
//                 "owned_by": "openai"
//             },
//             {
//                 "id": "gpt-3.5-turbo-1106",
//                 "object": "model",
//                 "created": 1698959748,
//                 "owned_by": "system"
//             },
//             {
//                 "id": "gpt-3.5-turbo-0301",
//                 "object": "model",
//                 "created": 1677649963,
//                 "owned_by": "openai"
//             },
//             {
//                 "id": "gpt-3.5-turbo-instruct",
//                 "object": "model",
//                 "created": 1692901427,
//                 "owned_by": "system"
//             },
//             {
//                 "id": "gpt-3.5-turbo-instruct",
//                 "object": "model",
//                 "created": 1692901427,
//                 "owned_by": "system"
//             },
//             {
//                 "id": "dall-e-3",
//                 "object": "model",
//                 "created": 1698785189,
//                 "owned_by": "system"
//             },
//             {
//                 "id": "dall-e-2",
//                 "object": "model",
//                 "created": 1698798177,
//                 "owned_by": "system"
//             },
//             {
//                 "id": "gpt-3.5-turbo-0125",
//                 "object": "model",
//                 "created": 1706048358,
//                 "owned_by": "system"
//             },
//             {
//                 "id": "text-embedding-ada-002",
//                 "object": "model",
//                 "created": 1671217299,
//                 "owned_by": "openai-internal"
//             }
//         ]
//     });
// });

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});