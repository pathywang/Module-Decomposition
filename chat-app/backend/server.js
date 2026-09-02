const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const messages = [];

app.get("/messages", (req, res) => {
  res.json(messages);
});

app.post("/messages", (req, res) => {
  const { username, message } = req.body;

  if (typeof username !== "string" || username.trim() === "") {
    res.status(400).send("Username cannot be empty.");
    return;
  }

  if (typeof message !== "string" || message.trim() === "") {
    res.status(400).send("Message cannot be empty.");
    return;
  }

  messages.push({
    username: username.trim(),
    message: message.trim(),
    timestamp: Date.now(),
  });

  res.send("ok");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});