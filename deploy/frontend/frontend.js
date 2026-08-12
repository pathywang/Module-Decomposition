const quoteElement = document.getElementById("quote");
const authorElement = document.getElementById("author");
const button = document.getElementById("new-quote");

async function showQuote() {
  const response = await fetch("http://127.0.0.1:3000/");
  const quote = await response.json();

  quoteElement.textContent = quote.quote;
  authorElement.textContent = quote.author;
}

function setup() {
  button.addEventListener("click", showQuote);
  showQuote();
}

window.addEventListener("load", setup);