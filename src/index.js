import "./output.css"
import { io } from "socket.io-client";

const socket = io('https://reverb.siting.xyz');

document.addEventListener("DOMContentLoaded", function() {
    const buttonContainer = document.getElementById("button-container");
    const mainContainer = document.getElementById("main-container")
    let lastClickedQuestion = null;
    const messageDiv = document.querySelector('.message-container');
    const firstMessageDiv = document.querySelector('.first-message');
    const secondMessageDiv = document.querySelector('.second-message');
    const showMessageButton = document.querySelector('.show');
    const dontShowMessageButton = document.querySelector('.dont-show');
    const backButton = document.querySelector('.back');
    const showWidget = documment.querySelector(".show-widget");
    const hideWidget = document.querySelector(".hide-widget")
    const widgetContainer = document.querySelector(".widget-container")

    

    backButton.addEventListener('click', function() {
        firstMessageDiv.style.display = 'block';
        secondMessageDiv.style.display = 'none';
    });

    showMessageButton.addEventListener('click', function() {
        messageDiv.style.display = 'block';
        showMessageButton.style.display = 'none';
        dontShowMessageButton.style.display = 'flex';
    });

    dontShowMessageButton.addEventListener('click', function() {
        messageDiv.style.display = 'none';
        showMessageButton.style.display = 'flex';
        dontShowMessageButton.style.display = 'none';
    });

    showWidget.addEventListener("click", function () {
        console.log("hello")
        widgetContainer.style.display = "flex"
        showWidget.style.display = "none"
        hideWidget.style.display = "block"
    })

    // Function to handle button click
    function handleButtonClick(event) {
        const buttonText = event.target.textContent;
        lastClickedQuestion = buttonText;
        sendRequest(buttonText);
    }

    // Function to make fetch request
    function sendRequest(text) {
        // Add loading message while waiting for response
        const loadingDots = document.createElement("div");
        loadingDots.className = "loading-dots";
        buttonContainer.appendChild(loadingDots);
        mainContainer.scrollTop = mainContainer.scrollHeight;

        // Use setTimeout to delay the execution of the code inside
        setTimeout(() => {
            fetch("http://127.0.0.1:5000/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: text })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                // Remove loading message
                buttonContainer.removeChild(loadingDots);

                // Add previous button
                const newConversation = document.createElement("hr")
                const previousButton = document.createElement("p");
                previousButton.className = "clicked-question";
                previousButton.textContent = lastClickedQuestion;
                buttonContainer.appendChild(newConversation)
                buttonContainer.appendChild(previousButton);

                // Add response with styling
                const responseDiv = document.createElement("div");
                responseDiv.className = "response";
                responseDiv.textContent = data.answer;
                buttonContainer.appendChild(responseDiv);

                // Add support message with link
                const supportPara = document.createElement("p");
                supportPara.className = "support"
                supportPara.textContent = "If you are not okay with the response, talk to ";
                const supportLink = document.createElement("span");
                supportLink.className = "support-link"
                supportLink.textContent = "support";
                supportPara.appendChild(supportLink);
                buttonContainer.appendChild(supportPara);
                supportLink.addEventListener('click', function() {
                    firstMessageDiv.style.display = 'none';
                    secondMessageDiv.style.display = 'flex';
                });

                // Dynamically create new questions based on the last clicked question
                createNewQuestions();
                mainContainer.scrollTop = mainContainer.scrollHeight;
            })
            .catch(error => {
                // Remove loading message if there's an error
                buttonContainer.removeChild(loadingMessage);

                // Handle errors
                console.error("There was a problem with the fetch operation:", error);
                buttonContainer.innerHTML = "Error fetching data.";
            });
        }, 100); // 30 seconds delay
    }

    // Function to create new questions
    function createNewQuestions() {
        // Add predefined new questions based on the last clicked question
        const newQuestions = {
            "Hello": ["How's your day?", "What brings you here?", "Nice to meet you!"],
            "How are you doing": ["What have you been up to?", "Anything interesting happening?", "How's life treating you?"],
            "How can we help you today": ["What can we assist you with?", "What brings you to us?", "How may we be of service?"],
        };

        // Add new buttons based on the last clicked question
        if (lastClickedQuestion && newQuestions[lastClickedQuestion]) {
            newQuestions[lastClickedQuestion].forEach(question => {
                const button = document.createElement("button");
                button.className = "question";
                button.textContent = question;
                buttonContainer.appendChild(button);
                button.addEventListener("click", handleButtonClick); // Add event listener to new button
            });
        }
    }

    // Add event listeners to initial buttons
    const buttons = document.querySelectorAll(".question");
    buttons.forEach(button => {
        button.addEventListener("click", handleButtonClick);
    });

});



// Function to display messages

async function displayMessages() {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';

    let conversationId = localStorage.getItem("conversationId");
    if (!conversationId) {
        console.error("No conversation ID found.");
        return;
    }

    const apiUrl = `https://reverb.siting.xyz/conversation/messages/${conversationId}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const messages = await response.json();
        const reverseMessage = messages.reverse()
        reverseMessage.forEach(msg => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            
            // Add CSS class based on senderType
            if (msg.senderType === 'user') {
                messageDiv.classList.add('user');
            } else if (msg.senderType === 'admin') {
                messageDiv.classList.add('admin');
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
socket.on('messageCreated', () => {
    // When a new message is created, call the function to fetch and display updated messages
    displayMessages();
});
// function sendMessage() {
//     const messageInput = document.getElementById('message-input');
//     const message = messageInput.value.trim();
//     if (message !== '') {
//         const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//         messages.push({ sender: 'User', message, time });
//         displayMessages();
//         messageInput.value = ''; // Clear input field
//         // Simulated response from admin after 1 second
//         setTimeout(() => {
//             const adminMessage = 'Sorry, I am just a simulation.';
//             const adminTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//             messages.push({ sender: 'Admin', message: adminMessage, time: adminTime });
//             displayMessages();
//         }, 1000);
//     }
// }

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
        const apiUrl = 'https://reverb.siting.xyz/conversation/request';
        sessionId = generateSessionId();
        localStorage.setItem("sessionId", sessionId);
        console.log(apiUrl, sessionId, message);
    
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uniqueId: sessionId, messageContent: message })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
            conversationId = data.id;
            localStorage.setItem("conversationId", conversationId);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            messageInput.value = "";
            displayMessages() // Clear input field
        }
    } else {
        const apiUrl = `https://reverb.siting.xyz/conversation/${conversationId}/continue`;
        console.log(conversationId);
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ senderType: "user", messageContent: message })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            messageInput.value = ""; // Clear input field
        }
    }
}

document.getElementById("send-message-btn").addEventListener("click", sendMessage)

// Event listener for Enter key press
document.getElementById('message-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        sendMessage();
        event.preventDefault(); // Prevents adding newline in the input field
    }
});

// Initial display of messages
displayMessages();
