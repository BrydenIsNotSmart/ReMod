const mongoose = require("mongoose");

let app = mongoose.Schema({

  id: {
    type: String,
    required: true
  },
  prefix: {
    type: String,
    required: false
  },
  modlogs: {
    type: String,
    required: false
  },
  messagelogs: {
    type: String,
    required: false
  },
  countingChannel: {
    type: String,
    required: false,
  },
  countingEnabled: {
    type: Boolean,
    default: false,
  },
  countingStats: {
    type: Object,
    required: false
  },
  countingNumber: {
    type: Number,
    required: false
  },
  countingMember: {
    type: String,
    required: false
  },
  countingReset: {
    type: Boolean,
    default: false
  },
  commandsRan: {
    type: Number,
    default: 0
  },
  bannedWords: {
    type: Array,
    required: false
  },
  dmOnBan: {
    type: Boolean, 
    default: true
  }
});

module.exports = mongoose.model("servers", app);