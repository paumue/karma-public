require("dotenv").config();
require('twilio');
const db = require("../database/connection");

jest.mock("twilio", () => jest.fn()); // prevent actual initalization of Twilio in client in tests

afterAll(() => { // close database pool after finishing test suite
    return db.end();
});
