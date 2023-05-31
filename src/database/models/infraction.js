const mongoose = require("mongoose");

let app = mongoose.Schema({

  userId: {
    type: String,
    required: true
  },
  type: {
    type: String, //warn, ban, kick
    required: true
  },
  serverId: {
    type: String,
    required: true
  },
  moderatorId: {
    type: String,
    required: false
  },
  reason: {
    type: String,
    required: false
  },
  givenAt: {
    type: Date,
    required: false
  } 

});

module.exports = mongoose.model("infractions", app);