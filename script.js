const messagesContainer = document.getElementById("messages");
const  messageInput = document.getElementById("user-input");

const categories = {
  Invoicing: [
    "How does verzo help with invoicing?",
    "I'm having issues sending an invoice to my customers",
    "How long does it take for my customers to get their invoice?",
    "How can I use my invoice ID?",
  ],
  Bookkeeping: [
    "How does verzo help with bookkeeping?",
    "What bookkeeping services do you offer?",
    "How can I manage my books efficiently?",
    "Can you help with bookkeeping software?",
  ],
  "Order-tracking": [
    "How does verzo help with order tracking?",
    "Can I track my orders in real-time?",
    "What order tracking features do you offer?",
    "How can I resolve order tracking issues?",
  ],
};

let currentCategory = null;
let currentQuestionIndex = 0;
let conversationLog = [];

function addMessage(text, isUser = false) {
  const message = document.createElement("div");
  message.classList.add("message", isUser ? "user" : "admin");
  message.innerText = text;
  messagesContainer.appendChild(message);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function fetchResponse(message) {
  fetch("http://localhost:8000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  })
    .then((response) => response.json())
    .then((data) => {
      addMessage(data.answer);
      conversationLog.push({ message, response: data.answer });
      if (currentQuestionIndex < categories[currentCategory].length) {
        displayNextQuestions();
      } else {
        askToChatWithRep();
      }
    })
    .catch((error) => {
      console.error("Error fetching prediction:", error);
    });
}

function displayCategoryButtons() {
  const categoriesContainer = document.createElement("div");
  Object.keys(categories).forEach((category) => {
    const questionDiv = document.createElement("div")
    questionDiv.classList.add("flex")
    const categoryButton = document.createElement("button");
    categoryButton.classList.add("admin")
    questionDiv.appendChild(categoryButton)
    categoryButton.innerText = category;
    categoryButton.onclick = () => {
      currentCategory = category;
      addMessage(category, true);
      displayNextQuestions();
    };
    categoriesContainer.appendChild(categoryButton);
  });
  messagesContainer.appendChild(categoriesContainer);
}

function displayNextQuestions() {
  clearQuestionButtons(); // Clear previous question buttons
  const questions = categories[currentCategory].slice(
    currentQuestionIndex,
    currentQuestionIndex + 2
  );
  currentQuestionIndex += 2;
  questions.forEach((question) => {
    const questionButton = document.createElement("button");
    questionButton.innerText = question;
    questionButton.onclick = () => {
      addMessage(question, true);
      fetchResponse(question);
    };
    messagesContainer.appendChild(questionButton);
  });
}

function askToChatWithRep() {
  clearQuestionButtons(); // Clear previous question buttons
  const question = "Would you like to chat with a representative?";
  addMessage(question);
  conversationLog.push({ question, response: null });
  const yesButton = document.createElement("button");
  yesButton.innerText = "Yes";
  yesButton.onclick = () => {
    addMessage("Yes", true);
    conversationLog.push({ question: "Yes", response: null });
    activateUserInput();
  };

  const noButton = document.createElement("button");
  noButton.innerText = "No";
  noButton.onclick = () => {
    addMessage("No", true);
    addMessage("Okay, let me know if you need any other help.");
    conversationLog.push({
      question: "No",
      response: "Okay, let me know if you need any other help.",
    });
    resetChat();
  };

  messagesContainer.appendChild(yesButton);
  messagesContainer.appendChild(noButton);
}

function activateUserInput() {
   messageInput.disabled = false;
   messageInput.focus();
   messageInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      const userMessage =  messageInput.value;
      addMessage(userMessage, true);
      conversationLog.push({ question: userMessage, response: null });
       messageInput.value = "";
      // Handle user input as needed
    }
  });
}

function resetChat() {
  currentCategory = null;
  currentQuestionIndex = 0;
  messagesContainer.innerHTML = ""; // Clear previous messages
  displayCategoryButtons(); // Display category buttons again
}

function clearQuestionButtons() {
  const buttons = messagesContainer.querySelectorAll("button");
  buttons.forEach((button) => button.remove());
}

document.addEventListener("DOMContentLoaded", () => {
  displayCategoryButtons();
  // Ensure input is disabled initially
   messageInput.disabled = true;
});
