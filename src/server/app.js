const express = require("express");
const app = express();

//-webserver-//
app.get('/', async (req, res) => {
    res.send("Hello World");
})

app.listen(config.port, () => {
    console.info(`[INFO] Running on port ${config.port}.`)
})