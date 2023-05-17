const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  balance: { type: Number, default: 0 },
  transtionHistory: [
    {
      typeName: String,
      mount: Number,
      date: { type: Date, default: Date.now() },
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
