const twilio = require("twilio");
const dotenv = require("dotenv");
dotenv.config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

module.exports = client;
