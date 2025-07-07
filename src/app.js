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
  mainWidgetContainer.style.display = "flex";
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

  // Listen for messages from the parent window
  window.addEventListener(
    "message",
    function (event) {
      if (event.origin === "https://verzo.app") {
        const message = event.data;
        if (message && message.developerKey) {
          checkCSS(message.developerKey);
        }
      }
    },
    false
  );
  // checkCSS("3738d7d0-ba8c-4ff8-a4da-ea0a9f1ea498");
});

function initializeWidget(developerKey) {
  // console.log("Initializing widget with developer key:", developerKey);
  const showWidget = document.querySelector(".show-widget");
  const hideWidget = document.querySelector(".hide-widget");
  const hidewidgetMobile = document.querySelector(".hide-widget-mobile");
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
    height: "80%", // Example Tailwind CSS height class
  };

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

  async function displayMessages() {
    const chatMessages = document.getElementById("chat-messages");
    const allMessages = document.querySelector(".all-messages");

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
      console.log(messages);
      const reverseMessage = messages.reverse();

      reverseMessage.forEach((msg) => {
        const messageDiv = document.createElement("div");

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

        messageDiv.innerHTML = `${msg.content}`;

        chatMessages.appendChild(messageDiv);
      });

      allMessages.scrollTop = allMessages.scrollHeight; // Scroll to bottom
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

  const sendMessageBtn = document.querySelector("#send-message-btn");
  sendMessageBtn.addEventListener("click", sendMessage);
  const messagesContainer = document.getElementById("messages");
  messageInput.disabled = true;
  const endSessionBtn = document.getElementById("end-session");

  const categories = {
    "Account Management": [
      "How do I update my account information?",
      "How do I reset my password?",
      "Can I add multiple users to my Verzo account?",
      "How can I complete my account setup?",
      "How can I create a card?",
      "How can I fund my account?",
    ],
    Invoicing: [
      "How do I create an invoice in Verzo?",
      "Can I set up recurring invoices?",
      "How do I customize my invoices with my business logo?",
      "Can I add payment terms and conditions to my invoices?",
      "How do I send invoices to my clients?",
      "Can I track the status of my invoices?",
      "How do I set up automatic payment reminders for my clients?",
      "Can I apply discounts or taxes to my invoices?",
    ],
    "Expense Tracking": [
      "How do I track my business expenses?",
      "Can I import expenses from my bank account?",
    ],
  };

  let currentCategory = null;
  let currentQuestionIndex = 0;
  let conversationLog =
    JSON.parse(localStorage.getItem("conversationLog")) || [];

  function addMessage(text, isUser = false) {
    const message = document.createElement("div");
    message.classList.add(isUser ? "user" : "admin");
    if (isUser) {
      message.classList.add("bg-blue-500");
    }
    message.innerText = text;
    messagesContainer.appendChild(message);
    // messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function saveToStorage(text, isUser) {
    const timestamp = new Date().toISOString(); // Get the current timestamp
    conversationLog.push({ text, isUser, timestamp }); // Add timestamp to the log
    localStorage.setItem("conversationLog", JSON.stringify(conversationLog));
  }

  function addTypingIndicator() {
    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add(
      "relative",
      "bg-gray-200",
      "typing",
      "mb-4",
      "h-6",
      "w-12",
      "flex",
      "items-center",
      "justify-center"
    );
    typingIndicator.innerHTML = `
    <div class="typing__dot bg-black"></div>
    <div class="typing__dot bg-black"></div>
    <div class="typing__dot bg-black"></div>
  `;
    messagesContainer.appendChild(typingIndicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return typingIndicator;
  }

  function removeTypingIndicator(typingIndicator) {
    typingIndicator.remove();
  }

  function fetchResponse(message) {
    const typingIndicator = addTypingIndicator();

    setTimeout(() => {
      fetch("https://reverb.siting.xyz/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })
        .then((response) => response.json())
        .then((data) => {
          removeTypingIndicator(typingIndicator);
          addMessage(data.answer);
          saveToStorage(data.answer, false);
          if (currentQuestionIndex < categories[currentCategory].length) {
            setTimeout(displayNextQuestions, 2000); // Delay before displaying next questions
          } else {
            askToChatWithRep();
          }
        })
        .catch((error) => {
          console.error("Error fetching prediction:", error);
          removeTypingIndicator(typingIndicator);
        });
    }, 2000); // Delay to show typing indicator before fetching response
  }

  function displayCategoryButtons() {
    const question = "Which of our services do you want support on?";
    addMessage(question);
    const categoriesContainer = document.createElement("div");
    categoriesContainer.classList.add("flex", "flex-col");
    Object.keys(categories).forEach((category) => {
      const categoryButton = document.createElement("button");
      categoryButton.classList.add("user-ques");
      categoryButton.innerText = category;
      categoryButton.onclick = () => {
        currentCategory = category;
        saveToStorage(question, false);
        addMessage(category, true);
        saveToStorage(category, true);
        clearOptionsContainer();
        displayNextQuestions();
      };
      categoriesContainer.appendChild(categoryButton);
    });
    messagesContainer.appendChild(categoriesContainer);
  }

  function displayInitialOptions() {
    const question = "Are you new to verzo?";
    addMessage(question);
    const optionsContainer = document.createElement("div");
    optionsContainer.classList.add("flex", "flex-col", "gap-y-1");
    optionsContainer.id = "initial-options"; // Adding an ID to clear it later

    const customerButton = document.createElement("button");
    customerButton.classList.add("user-ques");
    customerButton.innerText = "I'm already a customer";
    customerButton.onclick = () => {
      saveToStorage(question, false);
      addMessage("I'm already a customer", true);
      saveToStorage("I'm already a customer", true);
      clearOptionsContainer();
      displayCategoryButtons();
    };
    optionsContainer.appendChild(customerButton);

    const learnMoreButton = document.createElement("button");
    learnMoreButton.classList.add("user-ques");
    learnMoreButton.innerText = "I want to learn more about verzo";
    learnMoreButton.onclick = () => {
      saveToStorage(question, false);
      addMessage("I want to learn more about verzo", true);
      saveToStorage("I want to learn more about verzo", true);
      clearOptionsContainer();
      addMessage("You can visit our website to learn more about our services.");
      saveToStorage(
        "You can visit our website to learn more about our services.",
        false
      );
      askToChatWithRep();
    };
    optionsContainer.appendChild(learnMoreButton);

    messagesContainer.appendChild(optionsContainer);
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
      questionButton.classList.add("user-ques");
      questionButton.innerText = question;
      questionButton.onclick = () => {
        addMessage(question, true);
        saveToStorage(question, true);
        fetchResponse(question);
      };
      messagesContainer.appendChild(questionButton);
    });
  }

  const askToChatContainer = document.createElement("div");
  askToChatContainer.classList.add(
    "flex",
    "flex-row",
    "justify-center",
    "mt-2",
    "gap-x-2"
  );

  let chatRep = `<span class="flex gap-x-1">
                <svg
                  height="20px"
                  width="20px"
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 508 508"
                  xmlSpace="preserve"
                  fill="#000000"
                >
                  <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <circle
                      class="fill-[#7b9ba7]"
                      cx="254"
                      cy="254"
                      r="254"
                    ></circle>
                    {" "}
                    <path
                      class="fill-[#FFFFFF]"
                      d="M303.7,303.3c30.5-17.3,51-50.1,51-87.6c0-55.7-45.1-100.8-100.8-100.8S153.2,160,153.2,215.6 c0,37.6,20.6,70.3,51,87.6C141,319.3,89.7,365,66,424.8c46.5,51.1,113.5,83.2,188,83.2s141.5-32.1,188-83.2 C418.3,365,367,319.3,303.7,303.3z"
                    ></path>
                    {" "}
                    <path
                      class="fill-[#324A5E]"
                      d="M401.6,182.3h-15.8C370.9,123.4,317.5,79.6,254,79.6s-116.9,43.7-131.8,102.7h-15.8 c-5.4,0-9.8,4.4-9.8,9.8V240c0,5.4,4.4,9.8,9.8,9.8h20c6.1,0,10.8-5.5,9.7-11.4c-2-10.4-2.7-21.3-1.8-32.5 c4.8-59.3,53.6-106.9,113.1-110.1c69.2-3.8,126.8,51.5,126.8,119.9c0,7.8-0.8,15.3-2.2,22.7c-1.2,6,3.6,11.5,9.6,11.5h1.8 c-4.2,13-14.9,37.2-38.3,50.2c-19.6,10.9-44.3,11.9-73.4,2.8c-1.5-6.7-8.9-14.6-16.5-18.3c-9.8-4.9-15.9-0.8-19.4,6.2 s-3,14.3,6.7,19.2c8.6,4.3,21.6,5.2,27,0.5c13.9,4.3,26.9,6.5,39,6.5c15,0,28.5-3.3,40.4-10c27.5-15.3,38.8-43.7,42.8-57.2h9.9 c5.4,0,9.8-4.4,9.8-9.8v-47.9C411.4,186.7,407,182.3,401.6,182.3z"
                    ></path>
                    {" "}
                  </g>
                </svg>
                <p class="text-xs admin-pop text-gray-800">Hi there! How can we help you today?</p>
              </span>`;

  function askToChatWithRep() {
    clearQuestionButtons(); // Clear previous question buttons
    const question = "Would you like to chat with a representative?";
    addMessage(question);
    const yesButton = document.createElement("button");
    const popAdmin = document.createElement("div");
    popAdmin.innerHTML = chatRep;
    yesButton.classList.add("ans");
    askToChatContainer.appendChild(yesButton);
    yesButton.innerText = "Yes";
    yesButton.onclick = () => {
      saveToStorage(question, false);
      addMessage("Yes", true);
      saveToStorage("Yes", true);
      messagesContainer.appendChild(popAdmin);

      endSessionBtn.classList.remove("hidden");
      activateUserInput();
    };

    const noButton = document.createElement("button");
    askToChatContainer.appendChild(noButton);
    noButton.classList.add("ans");
    noButton.innerText = "No";
    noButton.onclick = () => {
      saveToStorage(question, false);
      addMessage("No", true);
      addMessage("Okay, let me know if you need any other help.");
      saveToStorage("No", true);
      saveToStorage("Okay, let me know if you need any other help.", false);
      endSessionBtn.classList.remove("hidden");
    };

    messagesContainer.appendChild(askToChatContainer);
  }

  function activateUserInput() {
    messageInput.disabled = false;
    messageInput.focus();
    clearQuestionButtons();
    console.log("Hello");
  }

  function resetChat() {
    currentCategory = null;
    currentQuestionIndex = 0;
    messagesContainer.innerHTML = ""; // Clear previous messages
    displayInitialOptions(); // Display initial options again
    messageInput.disabled = true; // Ensure input is disabled initially
    endSessionBtn.classList.add("hidden");
  }
  function clearLocalStorage() {
    localStorage.removeItem("conversationLog");
    localStorage.removeItem("sessionId");
    localStorage.removeItem("conversationId");
    resetChat();
    location.reload();
  }
  endSessionBtn.addEventListener("click", clearLocalStorage);

  async function checkAdminMessageAndReset() {
    const apiUrl = `https://reverb.siting.xyz/conversation/messages/${conversationId}`;

    try {
      // Fetch the messages from the API
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }
      const messages = await response.json();

      // Check if messages array is not empty
      if (messages.length > 0) {
        // Get the last message
        const lastMessage = messages[messages.length - 1];

        // Check if the last message is from an admin
        if (lastMessage.senderType === "admin") {
          const lastMessageTime = new Date(lastMessage.createdAt);
          const currentTime = new Date();

          // Calculate the time difference in minutes
          const timeDifference = (currentTime - lastMessageTime) / 1000 / 60;

          // If the time difference exceeds 30 minutes, reset the chat
          if (timeDifference > 30) {
            clearLocalStorage();
          }
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }

  function checkLastMessageAndReset() {
    const conversationLog = JSON.parse(localStorage.getItem("conversationLog"));

    if (conversationLog && conversationLog.length > 0) {
      const lastMessage = conversationLog[conversationLog.length - 1];

      // Check if the last message's `isUser` is `false`
      if (!lastMessage.isUser) {
        const lastMessageTime = new Date(lastMessage.timestamp); // Assuming a `timestamp` property exists
        const currentTime = new Date();

        // Check if the last message was created more than 30 minutes ago
        const timeDifference = (currentTime - lastMessageTime) / 1000 / 60; // Difference in minutes

        if (timeDifference > 30) {
          clearLocalStorage();
        }
      }
    }
  }

  function clearOptionsContainer() {
    const optionsContainer = document.getElementById("initial-options");
    if (optionsContainer) {
      optionsContainer.remove();
    }
  }

  function clearQuestionButtons() {
    const buttons = messagesContainer.querySelectorAll("button");
    buttons.forEach((button) => button.remove());
  }

  function loadConversation() {
    console.log("called ");
    const savedConversation =
      JSON.parse(localStorage.getItem("conversationLog")) || [];
    savedConversation.forEach((msg) => {
      addMessage(msg.text, msg.isUser);
    });

    if (savedConversation.length > 0) {
      const lastMessage = savedConversation[savedConversation.length - 1];
      const secondToLastMessage =
        savedConversation[savedConversation.length - 2];

      if (lastMessage.isUser) {
        if (lastMessage.text === "I'm already a customer") {
          displayCategoryButtons();
        } else if (Object.keys(categories).includes(lastMessage.text)) {
          currentCategory = lastMessage.text;
          currentQuestionIndex = 0;
          displayNextQuestions();
        } else if (lastMessage.text === "Yes") {
          activateUserInput();

          endSessionBtn.classList.remove("hidden");
        } else if (lastMessage.text === "No") {
          messageInput.disabled = true;
          endSessionBtn.classList.remove("hidden");
        }
      } else {
        if (
          Object.values(categories).flat().includes(secondToLastMessage.text)
        ) {
          currentCategory = Object.keys(categories).find((category) =>
            categories[category].includes(secondToLastMessage.text)
          );
          currentQuestionIndex =
            categories[currentCategory].indexOf(secondToLastMessage.text) + 1;
          if (currentQuestionIndex < categories[currentCategory].length) {
            displayNextQuestions();
          } else {
            askToChatWithRep();
          }
        } else {
          displayInitialOptions();
          endSessionBtn.classList.add("hidden");
        }
      }
    } else {
      displayInitialOptions();
      endSessionBtn.classList.add("hidden");
    }
  }

  // Ensure input is disabled initially

  messageInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      sendMessage();
      event.preventDefault();
    }
  });

  const isConversationLogEmpty = () => {
    const conversationLog = JSON.parse(localStorage.getItem("conversationLog"));
    return !conversationLog || conversationLog.length === 0;
  };

  // Example usage
  // Existing code
  
function updateIframeSize() {
  const contentHeight = document.body.scrollHeight;
  const newStyleData = {
    ...styleData,
    height: `${contentHeight}px`,
  };
  window.parent.postMessage(
    { type: "applyStyle", styleData: newStyleData },
    "*"
  );
}
  // New function to get responsive style data
  function getResponsiveStyleData() {
    if (window.innerWidth >= 768) {
      return { width: "420px", height: "80vh" };
    } else {
      return { width: "100%", height: "100vh" };
    }
  }

  function applyStyle(style) {
    const mainContainer = document.querySelector(".main-widget-container");
    if (mainContainer) {
      mainContainer.style.width = style.width;
      mainContainer.style.height = style.height;
    }
  }

  showWidget.addEventListener("click", function () {
    checkLastMessageAndReset();
    checkAdminMessageAndReset();
    checkConversationLog();
  });

  const checkConversationLog = () => {
    const responsiveStyle = getResponsiveStyleData();

    if (isConversationLogEmpty()) {
      messageDiv.style.display = "flex";
      widgetContainer.style.display = "block";
      showWidget.style.display = "none";
      hideWidget.classList.add("md:flex");
      hidewidgetMobile.classList.add("flex");
      hidewidgetMobile.classList.remove("hidden");
      window.parent.postMessage(
        { type: "applyStyle", styleData: responsiveStyle },
        "*"
      );
      applyStyle(responsiveStyle);

      hideWidget.addEventListener("click", hideWidgetHandler);
      hidewidgetMobile.addEventListener("click", hideWidgetMobileHandler);
      goToChat.addEventListener("click", goToChatHandler);
      goToWidgetContainer.addEventListener("click", goToWidgetContainerHandler);
    } else {
      messageDiv.style.display = "flex";
      widgetContainer.style.display = "none";
      showWidget.style.display = "none";
      hideWidget.classList.add("md:flex");
      hidewidgetMobile.classList.add("flex");
      hidewidgetMobile.classList.remove("hidden");
      chatSession.style.display = "flex";
      window.parent.postMessage(
        { type: "applyStyle", styleData: responsiveStyle },
        "*"
      );
      applyStyle(responsiveStyle);

      hideWidget.addEventListener("click", hideWidgetHandler);
      hidewidgetMobile.addEventListener("click", hideWidgetMobileHandler);
      goToChat.addEventListener("click", goToChatHandler);
      goToWidgetContainer.addEventListener("click", goToWidgetContainerHandler);
    }
  };

  function hideWidgetHandler() {
    showWidget.style.display = "flex";
    hideWidget.classList.remove("md:flex");
    widgetContainer.style.display = "none";
    messageDiv.style.display = "none";
    chatSession.style.display = "none";
    window.parent.postMessage({ type: "clearStyle" }, "*");
  }

  function hideWidgetMobileHandler() {
    showWidget.style.display = "flex";
    hideWidget.classList.remove("md:flex");
    hidewidgetMobile.classList.remove("flex");
    hidewidgetMobile.classList.add("hidden");
    widgetContainer.style.display = "none";
    messageDiv.style.display = "none";
    chatSession.style.display = "none";
    window.parent.postMessage({ type: "clearStyle" }, "*");
  }

  function goToChatHandler() {
    widgetContainer.style.display = "none";
    chatSession.style.display = "flex";
  }

  function goToWidgetContainerHandler() {
    widgetContainer.style.display = "block";
    chatSession.style.display = "none";
  }

  // Handle messages from parent
  loadConversation();
  getPreferenceColor();
  const init = async () => {
    await fetchAndDisplayArticles();
    await displayMessages();
  };
  init();
}
