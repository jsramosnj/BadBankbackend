const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./models/userModel");
const dotenv = require("dotenv");

const app = express();

// config cors
app.use(cors());

//dotenv config
dotenv.config();

// config body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// connection to database
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.2h3d5pl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(uri);

/**
 * Create enpoints
 * Create user
 */

app.post("/users", async (req, res) => {
  const { name, email, password, balance } = req.body;
  const newUser = new User({ name, email, password, balance });
  await newUser.save();
  res.json(newUser);
});

/**
 * Get user by id
 */

app.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

/**
 * List users
 */

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

/**
 * Edit user
 */

app.patch("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const user = await User.findByIdAndUpdate(
    id,
    { name, email, password },
    { new: true }
  );
  res.json(user);
});

/**
 * Add deposit
 */

app.post("/users/:id/deposit", async (req, res) => {
  const user = await User.findById(req.params.id);
  console.log(user);
  const { mount } = req.body;
  user.balance += mount;
  user.transtionHistory.push({
    typeName: "deposit",
    mount,
  });
  await user.save();
  res.json();
});

/**
 * withdraw mount
 */

app.post("/users/:id/withdraw", async (req, res) => {
  const user = await User.findById(req.params.id);
  const { mount } = req.body;
  if (mount > user.mount) {
    res.status(400).json({ error: "No enought money" });
    return;
  }
  user.balance -= mount;
  user.transtionHistory.push({
    typeName: "Withdraw",
    mount,
  });
  await user.save();
  res.json(user);
});

/**
 * validate user
 */
app.post("/validate", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User no found" });
  }
  return res.json(user);
});

/**
 * list transaction history
 */

app.get("/users/:id/transactions", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user.transtionHistory);
});

/**
 * get balance
 */

app.get("/users/:id/getBalance", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user.balance);
});

// start server
app.listen(3000 || 4000, () => {
  console.log(`server running ${3000}`);
});
