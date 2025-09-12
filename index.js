const express = require("express");
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 4000;

app.use(express.json());

require('./config/database').connect();

// Import routes
const user = require("./routes/user");
app.use("/api/v1", user);

//activate the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});