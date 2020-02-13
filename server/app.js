require('dotenv/config');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

// Import Routes
const usersRoute = require('./routes/users');
const causesRoute = require('./routes/causes');
const forgotPasswordRoute = require('./routes/forgotPassword');
const verificationRoute = require('./routes/verification');
// Midleware
app.use(express.json());

app.use('/', require('./routes/index'));
app.use('/users', usersRoute);
app.use('/login/forgotPassword', forgotPasswordRoute);
app.use('/verify', verificationRoute);
app.use('/causes', causesRoute);

app.listen(PORT, console.log(`Listening on port ${PORT} ...`));
