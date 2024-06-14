 /* const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
require('dotenv').config();  // Ensure you have dotenv to load environment variables

const app = express();

// Load Omnisend API Key from environment variables
const apiKey = process.env.OMNISEND_API_KEY;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Serve the form page
app.get('/join', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        const data = {
            name: name,
            identifiers: [
                {
                    type: 'email',
                    channels: {
                        email: {
                            status: 'subscribed',
                            statusDate: new Date().toISOString()
                        }
                    },
                    id: email,
                    sendWelcomeMessage: true
                },
                {
                    type: 'sms',
                    channels: {
                        sms: {
                            status: 'subscribed',
                            statusDate: new Date().toISOString()
                        }
                    },
                    id: phone
                }
            ],
            customProperties: {
                landingPage: 'Kelly',
            }
        };

        const response = await axios.post(
            'https://api.omnisend.com/v3/contacts',
            data,
            {
                headers: {
                    "X-API-KEY": apiKey,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }
        );

        console.log('Data sent to Omnisend successfully:', response.data);
        res.status(200).send('Form submitted successfully');
    } catch (error) {
        console.error('Error sending data to Omnisend:', error.response ? error.response.data : error.message);
        res.status(500).send('Error submitting form');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
*/

const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Load Omnisend API Key from environment variables
const apiKey = process.env.OMNISEND_API_KEY;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Serve the form page
app.get('/join', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).send('All fields are required');
        }

        const data = {
            name: name,
            identifiers: [
                {
                    type: 'email',
                    channels: {
                        email: {
                            status: 'subscribed',
                            statusDate: new Date().toISOString()
                        }
                    },
                    id: email,
                    sendWelcomeMessage: true
                },
                {
                    type: 'sms',
                    channels: {
                        sms: {
                            status: 'subscribed',
                            statusDate: new Date().toISOString()
                        }
                    },
                    id: phone
                }
            ],
            customProperties: {
                landingPage: 'Kelly',
            }
        };

        const response = await axios.post(
            'https://api.omnisend.com/v3/contacts',
            data,
            {
                headers: {
                    "X-API-KEY": apiKey,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }
        );

        console.log('Data sent to Omnisend successfully:', response.data);
        res.status(200).send('Form submitted successfully');
    } catch (error) {
        if (error.response) {
            // Server responded with a status other than 200 range
            console.error('Error response from Omnisend:', error.response.data);
            res.status(error.response.status).send(error.response.data);
        } else if (error.request) {
            // No response was received
            console.error('No response received from Omnisend:', error.request);
            res.status(500).send('No response received from Omnisend');
        } else {
            // Something else happened while setting up the request
            console.error('Error sending data to Omnisend:', error.message);
            res.status(500).send(error.message);
        }
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});