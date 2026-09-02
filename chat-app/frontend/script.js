const usernameInput = document.querySelector("#username");
const messageInput = document.querySelector("#message");
const sendButton = document.querySelector("#send");
const messagesList = document.querySelector("#messages");
const error = document.querySelector("#error");

const server =
  "https://mcc7a7ee5emoct93laditnv2.trainees.hosting.cyf.academy";

let messages = [];

function render() {
  messagesList.innerHTML = "";

  for (const message of messages) {
    const li = document.createElement("li");

    const time = new Date(message.timestamp).toLocaleTimeString();

    li.textContent =
      `${message.username}: ${message.message} (${time})`;

    messagesList.appendChild(li);
  }
}

async function keepFetchingMessages() {
  try {
    const lastMessageTime =
      messages.length > 0
        ? messages[messages.length - 1].timestamp
        : null;

    const queryString =
      lastMessageTime
        ? `?since=${lastMessageTime}&longPoll=true`
        : "?longPoll=true";

    const response = await fetch(
      `${server}/messages${queryString}`
    );

    if (!response.ok) {
      error.textContent = "Failed to get messages.";
      setTimeout(keepFetchingMessages, 1000);
      return;
    }

    const newMessages = await response.json();

    messages.push(...newMessages);

    render();

    keepFetchingMessages();

  } catch (err) {
    error.textContent =
      "Could not connect to the backend.";

    setTimeout(keepFetchingMessages, 1000);
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

  } catch (err) {
    error.textContent =
      "Could not connect to the backend.";
  }
}

sendButton.addEventListener("click", sendMessage);

keepFetchingMessages();