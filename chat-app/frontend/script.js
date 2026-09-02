const usernameInput = document.querySelector("#username");
const messageInput = document.querySelector("#message");
const sendButton = document.querySelector("#send");
const messagesList = document.querySelector("#messages");
const error = document.querySelector("#error");

const server = "http://127.0.0.1:3000";

async function loadMessages() {
  try {
    const response = await fetch(`${server}/messages`);

    if (!response.ok) {
      error.textContent = "Failed to load messages.";
      return;
    }

    const messages = await response.json();

    messagesList.innerHTML = "";

    for (const message of messages) {
      const li = document.createElement("li");

      const time = new Date(message.timestamp).toLocaleTimeString();

      li.textContent =
        `${message.username}: ${message.message} (${time})`;

      messagesList.appendChild(li);
    }
  } catch (err) {
    error.textContent = "Could not connect to the backend.";
  }
}

async function sendMessage() {
  const username = usernameInput.value;
  const message = messageInput.value;

  if (username.trim() === "") {
    error.textContent = "Please enter a username.";
    return;
  }

  if (message.trim() === "") {
    error.textContent = "Please enter a message.";
    return;
  }

  try {
    const response = await fetch(`${server}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username,
        message: message
      })
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      error.textContent = errorMessage;
      return;
    }

    error.textContent = "";
    messageInput.value = "";

    await loadMessages();

  } catch (err) {
    error.textContent =
      "Could not connect to the backend. Is it running?";
  }
}

sendButton.addEventListener("click", sendMessage);

loadMessages();