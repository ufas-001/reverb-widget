import "./output.css";
import { io } from "socket.io-client";

const socket = io("https://reverb.siting.xyz");

function cssLoaded() {
  for (let i = 0; i < document.styleSheets.length; i++) {
    try {
      // console.log(`Checking stylesheet ${i}: ${document.styleSheets[i].href}`);
      if (
        document.styleSheets[i].href &&
        document.styleSheets[i].cssRules &&
        document.styleSheets[i].cssRules.length === 0
      ) {
        return false;
      }
    } catch (e) {
      if (e.name !== "SecurityError") throw e;
    }
  }
  // console.log("All CSS loaded.");
  return true;
}

const mainWidgetContainer = document.querySelector(".main-widget-container");

function showWidgetContainer() {
  mainWidgetContainer.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
  // console.log("DOM fully loaded and parsed.");
  function checkCSS(developerKey) {
    if (cssLoaded()) {
      showWidgetContainer();
      initializeWidget(developerKey);
    } else {
      setTimeout(() => checkCSS(developerKey), 100);
    }
  }

  // // Listen for messages from the parent window
  // window.addEventListener(
  //   "message",
  //   function (event) {
  //     if (event.origin === "https://verzo.app") {
  //       const message = event.data;
  //       if (message && message.developerKey) {
  //         checkCSS(message.developerKey);
  //       }
  //     }
  //   },
  //   false
  // );
  checkCSS("3738d7d0-ba8c-4ff8-a4da-ea0a9f1ea498");
});

function initializeWidget(developerKey) {
  // console.log("Initializing widget with developer key:", developerKey);
  const showWidget = document.querySelector(".show-widget");
  const hideWidget = document.querySelector(".hide-widget");
  const widgetContainer = document.querySelector(".widget-container");
  const goToChat = document.querySelector(".go-to-chat");
  const chatSession = document.querySelector(".message-session");
  const goToWidgetContainer = document.querySelector(".back-to-container");
  const messageDiv = document.querySelector(".message-container");
  const apiKey = developerKey;

  let primaryColor;

  const getPreferenceColor = async () => {
    try {
      const response = await fetch(
        `https://reverb.siting.xyz/preference/${apiKey}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Include any other headers if needed
          },
          credentials: "include", // If you need to include cookies
        }
      );
      // console.log("response", response);
      if (response.ok) {
        const data = await response.json();
        primaryColor = data.backgroundColor;
        console.log(primaryColor);
        // handleColorPreference(primaryColor);
      } else {
        primaryColor = "blue";
      }
    } catch (error) {
      // handleColorPreference(primaryColor);
      // console.error("Error fetching preferences:", error);
    }
  };

  socket.on("messageCreated", () => {
    displayMessages();
  });

  // const handleColorPreference = (primaryColor) => {
  //   const widgetContainer = document.getElementById("widget-container");
  //   const headings = document.querySelectorAll(".heading");
  //   const lightTexts = document.querySelectorAll(".light-text");
  //   const bgLights = document.querySelectorAll(".bg-light");
  //   const messageSession = document.getElementById("message-session");
  //   const bgHeavys = document.querySelectorAll(".bg-heavy");
  //   const bgMedium = document.querySelectorAll(".bg-medium");
  //   const textCustom = document.querySelectorAll(".text-custom");

  //   // Function to add class to NodeList
  //   const addClassToElements = (elements, className) => {
  //     elements.forEach((element) => {
  //       element.classList.add(className);
  //     });
  //   };

  //   switch (primaryColor) {
  //     case "black":
  //       widgetContainer.classList.add("bg-slate-800");
  //       addClassToElements(headings, "text-gray-700");
  //       addClassToElements(lightTexts, "text-gray-600");
  //       addClassToElements(bgLights, "bg-gray-200");
  //       messageSession.classList.add("bg-slate-800");
  //       addClassToElements(bgHeavys, "bg-black");
  //       addClassToElements(bgMedium, "bg-custom-blue");
  //       addClassToElements(textCustom, "text-custom-blue");
  //       break;

  //     case "gray":
  //       widgetContainer.classList.add("bg-gray-700");
  //       addClassToElements(headings, "text-gray-700");
  //       addClassToElements(lightTexts, "text-gray-600");
  //       addClassToElements(bgLights, "bg-gray-200");
  //       messageSession.classList.add("bg-slate-800");
  //       addClassToElements(bgHeavys, "bg-black");
  //       addClassToElements(bgMedium, "bg-custom-blue");
  //       addClassToElements(textCustom, "text-custom-blue");
  //       break;

  //     case "dark-gray":
  //       widgetContainer.classList.add("custom-bg");
  //       addClassToElements(headings, "text-gray-700");
  //       addClassToElements(lightTexts, "text-gray-600");
  //       addClassToElements(bgLights, "bg-gray-200");
  //       messageSession.classList.add("bg-slate-800");
  //       addClassToElements(bgHeavys, "bg-black");
  //       addClassToElements(bgMedium, "bg-custom-blue");
  //       addClassToElements(textCustom, "text-custom-blue");
  //       break;

  //     case "blue":
  //       widgetContainer.classList.add("bg-blue-700");
  //       addClassToElements(headings, "text-blue-700");
  //       addClassToElements(lightTexts, "text-blue-500");
  //       addClassToElements(bgLights, "bg-blue-100");
  //       messageSession.classList.add("bg-blue-700");
  //       addClassToElements(bgHeavys, "bg-blue-700");
  //       break;

  //     case "red":
  //       widgetContainer.classList.add("bg-red-700");
  //       addClassToElements(headings, "text-red-700");
  //       addClassToElements(lightTexts, "text-red-500");
  //       addClassToElements(bgLights, "bg-red-100");
  //       messageSession.classList.add("bg-red-700");
  //       addClassToElements(bgHeavys, "bg-red-700");
  //       break;
  //     default:
  //       widgetContainer.classList.add("bg-blue-700");
  //       addClassToElements(headings, "text-blue-700");
  //       addClassToElements(lightTexts, "text-blue-500");
  //       addClassToElements(bgLights, "bg-blue-100");
  //       messageSession.classList.add("bg-blue-700");
  //       addClassToElements(bgHeavys, "bg-blue-700");
  //       break;
  //   }
  // };
  const styleData = {
    width: "500px", // Example Tailwind CSS width class
    height: "85%", // Example Tailwind CSS height class
  };

  showWidget.addEventListener("click", function () {
    messageDiv.style.display = "flex";
    widgetContainer.style.display = "block";
    showWidget.style.display = "none";
    hideWidget.style.display = "flex";
    window.parent.postMessage({ type: "applyStyle", styleData }, "*");
  });

  hideWidget.addEventListener("click", () => {
    showWidget.style.display = "block";
    hideWidget.style.display = "none";
    widgetContainer.style.display = "none";
    messageDiv.style.display = "none";
    chatSession.style.display = "none";
    window.parent.postMessage({ type: "clearStyle" }, "*");
  });

  goToChat.addEventListener("click", () => {
    widgetContainer.style.display = "none";
    chatSession.style.display = "flex";
  });

  goToWidgetContainer.addEventListener("click", () => {
    widgetContainer.style.display = "block";
    chatSession.style.display = "none";
  });

  let typing = false;
  let userTypingTimeout = null;
  let otherUserTypingTimeout = null;
  let timer = null;
  let typingInterval = null;
  let sessionId = localStorage.getItem("sessionId");
  let conversationId = localStorage.getItem("conversationId");
  const messageInput = document.getElementById("message-input");
  const senderType = "user";

  function handleTyping() {
    if (socket && conversationId) {
      // console.log(senderType);
      socket.emit("typing", { conversationId, senderType });
    }
  }

  messageInput.addEventListener("input", (e) => {
    // console.log("tying is on by user");
    handleTyping();
  });

  // Function to handle incoming typing events
  let adminTyping = false;

  if (conversationId) {
    socket.on(`userTyping:${conversationId}`, (data) => {
      // console.log("data: ", data);
      if (data.senderType !== senderType) {
        adminTyping = true;
        // console.log("other user is typing");
        getTyping();
        if (otherUserTypingTimeout) {
          clearTimeout(otherUserTypingTimeout);
        }
        otherUserTypingTimeout = setTimeout(() => {
          adminTyping = false;
          //console.log("other user stopped typing");
          //console.log("Admin typing", adminTyping);
        }, 8000); // Hide notification after 1 second of inactivity
      }
    });
  }

  // Clean up event listener when necessary
  // window.addEventListener("beforeunload", () => {
  //   if (conversationId) {
  //     socket.off(`userTyping:${conversationId}`, (data) => {
  //       console.log("data: ", data);
  //       if (data.senderType !== senderType) {
  //         adminTyping = true;
  //         if (otherUserTypingTimeout) {
  //           clearTimeout(otherUserTypingTimeout);
  //         }
  //         otherUserTypingTimeout = setTimeout(() => {
  //           adminTyping = false;
  //           console.log("other user stopped typing");
  //         }, 1000); // Hide notification after 1 second of inactivity
  //       }
  //     });
  //   }
  //   if (userTypingTimeout) {
  //     clearTimeout(userTypingTimeout);
  //   }
  //   if (otherUserTypingTimeout) {
  //     clearTimeout(otherUserTypingTimeout);
  //   }
  // });
  const chatMessages = document.getElementById("chat-messages");

  async function displayMessages() {
    const chatMessages = document.getElementById("chat-messages");

    chatMessages.innerHTML = "";

    let conversationId = localStorage.getItem("conversationId");
    if (!conversationId) {
      // console.error("No conversation ID found.");
      return;
    }

    const apiUrl = `https://reverb.siting.xyz/conversation/messages/${conversationId}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const messages = await response.json();
      // console.log(`Messages:${when} `, messages);
      const reverseMessage = messages.reverse();

      reverseMessage.forEach((msg) => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");

        // Add CSS class based on senderType
        if (msg.senderType === "user") {
          messageDiv.classList.add("user");
          if (primaryColor === "black") {
            messageDiv.classList.add("bg-black");
          } else if (primaryColor === "blue") {
            messageDiv.classList.add("bg-blue-500");
          } else {
            messageDiv.classList.add("bg-blue-500");
          }
        } else if (msg.senderType === "admin") {
          messageDiv.classList.add("admin");
        }

        messageDiv.innerHTML = `
              ${msg.content}
            `;
        chatMessages.appendChild(messageDiv);
      });

      chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
    } catch (error) {
      console.error("Error:", error);
    }
  }
  const getTyping = () => {
    const typingClassName = "typing-indicator";

    if (adminTyping) {
      // console.log("adminTyping: ", adminTyping);

      // Check if there's already a typing indicator
      let typingIndicator = chatMessages.querySelector(`.${typingClassName}`);

      if (!typingIndicator) {
        // Create the typing indicator if it doesn't exist
        typingIndicator = document.createElement("div");
        typingIndicator.className = typingClassName;
        typingIndicator.innerHTML = `
            <div class=" relative bg-gray-200 typing mb-4 h-6 w-12 flex items-center justify-center">
              <div class="typing__dot bg-black"></div>
              <div class="typing__dot bg-black"></div>
              <div class="typing__dot bg-black"></div>
            </div>
           `;
        chatMessages.appendChild(typingIndicator);
      }
    } else {
      // Remove the typing indicator if adminTyping is false
      let typingIndicator = chatMessages.querySelector(`.${typingClassName}`);
      if (typingIndicator) {
        chatMessages.removeChild(typingIndicator);
      }
    }
  };

  // Listen for 'messageCreated' event emitted by the server via Socket.IO

  function generateSessionId() {
    return Math.random().toString(36).substr(2, 9); // Generate a random alphanumeric string
  }

  // Function to send message to the backend
  async function sendMessage() {
    const message = messageInput.value.trim();
    // Check if the message is empty
    if (!message) {
      return; // Exit the function early
    }
    if (!sessionId) {
      // If sessionId is not set in local storage, generate a new one
      const apiUrl = "https://reverb.siting.xyz/conversation/request";
      sessionId = generateSessionId();
      localStorage.setItem("sessionId", sessionId);
      // console.log(apiUrl, sessionId, message);

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
        conversationId = data.conversationId;
        localStorage.setItem("conversationId", conversationId);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        messageInput.value = "";
      }
    } else {
      const apiUrl = `https://reverb.siting.xyz/conversation/${conversationId}/continue`;
      //console.log(conversationId);
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
        typing = false;
        messageInput.value = ""; // Clear input field
      }
    }
  }

  async function fetchAndDisplayArticles() {
    try {
      // Step 1: Fetch the data from the API
      const response = await fetch(
        `https://reverb.siting.xyz/article/${apiKey}`
      ); // Replace with your actual API endpoint
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // console.log("data: ", data);

      // Access the actual articles array from response.data
      const articles = data; // Assuming the articles are inside `data` property

      // Step 2: Create a list of anchor tags
      const articleLinksDiv = document.getElementById("article-links");
      articleLinksDiv.innerHTML = ""; // Clear existing content if any

      articles.forEach((article) => {
        // Create the anchor element
        const anchor = document.createElement("a");
        anchor.href = article.link;
        const textSpan = document.createElement("span");
        if (primaryColor === "black") {
          // console.log("pri", primaryColor);
          anchor.className =
            "p-1 flex text-[15px] font-light items-center justify-between hover:rounded-md gap-x-2 cursor-pointer text-gray-600";
          textSpan.className = "text-gray-600";
        } else if (primaryColor === "blue") {
          anchor.className =
            "p-1 flex text-[15px] font-light items-center justify-between hover:rounded-md gap-x-2 cursor-pointer text-blue-500";
          textSpan.className = "text-blue-500";
        } else {
          anchor.className =
            "p-1 flex text-[15px] font-light items-center justify-between hover:rounded-md gap-x-2 cursor-pointer text-blue-500";
          textSpan.className = "text-blue-500";
        }
        anchor.target = "_blank"; // Open link in a new tab

        // Create the span for the text

        textSpan.textContent = article.header;

        // Create the span for the SVG
        const svgSpan = document.createElement("span");

        // Create the SVG element
        const svg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        svg.setAttribute("class", "w-5 h-5 light-text");
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("width", "24");
        svg.setAttribute("height", "24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("viewBox", "0 0 24 24");

        // Create the path element
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        path.setAttribute("stroke", "currentColor");
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");
        path.setAttribute("stroke-width", "2");
        path.setAttribute("d", "M19 12H5m14 0-4 4m4-4-4-4");

        // Append the path to the SVG
        svg.appendChild(path);

        // Append the SVG to the svgSpan
        svgSpan.appendChild(svg);

        // Append the text span and svg span to the anchor
        anchor.appendChild(textSpan);
        anchor.appendChild(svgSpan);

        // Append the anchor to the div
        articleLinksDiv.appendChild(anchor);
      });
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  }
  getPreferenceColor();
  const init = async () => {
    await fetchAndDisplayArticles();
    await displayMessages();
  };

  init();
  const sendMessageBtn = document.querySelector("#send-message-btn");
  sendMessageBtn.addEventListener("click", sendMessage);

  messageInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      sendMessage();
      event.preventDefault();
    }
  });
}
