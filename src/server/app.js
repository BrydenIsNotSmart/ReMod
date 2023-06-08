const express = require("express");
const app = express();

//-webserver-//
app.get('/', async (req, res) => {
    res.send("Hello World");
})

const apiRouter = require("./routes/api.js");
app.use("/api", apiRouter);

app.listen(config.port, () => {
    console.info(`[INFO] Running on port ${config.port}.`)
})