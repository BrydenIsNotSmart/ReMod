const express = require("express");
const router = express.Router();

router.get('/', async (req, res) => {
  res.send("Hello World")
})

router.post("/github/webhook", async function(req, res) {
    console.log(req.body);
  
    /*const payload = req.body;
  
    let webhook_info = {
      repo : payload.repository.name,
      author : payload.sender.login,
      time : payload.head_commit.timestamp
    }
    
    const save_webhook = await req.db
    .collection("webhooks")
    .insertOne(webhook_info);
  
    res.status(201).send({
      message: "Webhook Event successfully logged"
    });*/ 
  });
  

module.exports = router;
