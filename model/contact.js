const mongoose = require("mongoose");

//membuat schema
const Contact = mongoose.model("Contact", {
  name: {
    type: String,
    required: true,
  },
  nohp: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

module.exports = Contact;
