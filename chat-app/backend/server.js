const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const messages = [];
const waitingClients = [];

// GET messages
app.get("/messages", (req, res) => {
  const since = req.query.since ? Number(req.query.since) : null;
  const longPoll = req.query.longPoll === "true";

  // Find messages the client doesn't already have
  const newMessages = since === null
    ? messages
    : messages.filter(message => message.timestamp > since);

  // If there are new messages, send them immediately
  if (newMessages.length > 0) {
    res.json(newMessages);
    return;
  }

  // Normal polling: respond immediately with an empty array
  if (!longPoll) {
    res.json([]);
    return;
  }

  // Long-polling: keep this request open
  waitingClients.push({
    res,
    since
  });
});

// POST a new message
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

  const newMessage = {
    username: username.trim(),
    message: message.trim(),
    timestamp: Date.now()
  };

  messages.push(newMessage);

  // Send the new message to every client currently waiting
  for (const client of waitingClients) {
    const messagesForClient = messages.filter(
      message => message.timestamp > (client.since ?? -Infinity)
    );

    if (messagesForClient.length > 0) {
      client.res.json(messagesForClient);
    }
  }

  // The waiting requests have now been answered
  waitingClients.length = 0;

  res.send("ok");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});