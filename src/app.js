document.addEventListener("DOMContentLoaded", function () {
  const showWidget = document.querySelector(".show-widget");
  const hideWidget = document.querySelector(".hide-widget");
  const widgetContainer = document.querySelector(".widget-container");
  const goToChat = document.querySelector(".go-to-chat");
  const chatSession = document.querySelector(".message-session");
  const goToWidgetContainer = document.querySelector(".back-to-container");
  const messageDiv = document.querySelector(".message-container");

  showWidget.addEventListener("click", function () {
    messageDiv.style.display = "flex";
    widgetContainer.style.display = "block";
    showWidget.style.display = "none";
    hideWidget.style.display = "block";
  });

  hideWidget.addEventListener("click", () => {
    showWidget.style.display = "block";
    hideWidget.style.display = "none";
    widgetContainer.style.display = "none";
    messageDiv.style.display = "none";
    chatSession.style.display = "none";
  });

  goToChat.addEventListener("click", () => {
    widgetContainer.style.display = "none";
    chatSession.style.display = "flex";
  });

  goToWidgetContainer.addEventListener("click", () => {
    widgetContainer.style.display = "block";
    chatSession.style.display = "none";
  });

  async function displayMessages() {
    const chatMessages = document.getElementById("chat-messages");
    chatMessages.innerHTML = "";

    let conversationId = localStorage.getItem("conversationId");
    if (!conversationId) {
      console.error("No conversation ID found.");
      return;
    }

    const apiUrl = `https://reverb.siting.xyz/conversation/messages/${conversationId}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const messages = await response.json();
      const reverseMessage = messages.reverse();
      reverseMessage.forEach((msg) => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");

        // Add CSS class based on senderType
        if (msg.senderType === "user") {
          messageDiv.classList.add("user");
        } else if (msg.senderType === "admin") {
          messageDiv.classList.add("admin");
        }

        messageDiv.innerHTML = `
                <div class="sender">${msg.content} </div>
            `;
        chatMessages.appendChild(messageDiv);
      });

      chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Listen for 'messageCreated' event emitted by the server via Socket.IO
  // socket.on("messageCreated", () => {
  //   // When a new message is created, call the function to fetch and display updated messages
  //   displayMessages();
  // });
  function generateSessionId() {
    return Math.random().toString(36).substr(2, 9); // Generate a random alphanumeric string
  }

  // Function to send message to the backend
  async function sendMessage() {
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value.trim();
    let sessionId = localStorage.getItem("sessionId");
    let conversationId = localStorage.getItem("conversationId");
    console.log("Hello");

    if (!sessionId) {
      // If sessionId is not set in local storage, generate a new one
      const apiUrl = "https://reverb.siting.xyz/conversation/request";
      sessionId = generateSessionId();
      localStorage.setItem("sessionId", sessionId);
      console.log(apiUrl, sessionId, message);

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uniqueId: sessionId,
            messageContent: message,
          }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        const data = await response.json();
        conversationId = data.id;
        localStorage.setItem("conversationId", conversationId);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        messageInput.value = "";
        displayMessages(); // Clear input field
      }
    } else {
      const apiUrl = `https://reverb.siting.xyz/conversation/${conversationId}/continue`;
      console.log(conversationId);
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ senderType: "user", messageContent: message }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        messageInput.value = ""; // Clear input field
      }
    }
  }

  document
    .getElementById("send-message-btn")
    .addEventListener("click", sendMessage);

  // Event listener for Enter key press
  document
    .getElementById("message-input")
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
        sendMessage();
        event.preventDefault(); // Prevents adding newline in the input field
      }
    });

  displayMessages();
});
