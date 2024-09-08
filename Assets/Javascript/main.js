const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");

let userText = null;
const API_KEY = "";

const createElement= (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv;
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const getChatResponse = async() => {
    const API_URL = "https://api.openai.com/v1/completions";

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo-instruct",
            prompt: userText,
            max_tokens: 2048,
            temperature: 0.2,
            n: 1,
            stop: null
        })
    }

    try {
        const response = await fetch(API_URL, requestOptions);
        if (response.status === 429) {
            console.error("Too many requests. Try again later.");
            return;
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error occurred:", error);
    }
}


const showTypingAnimation = () => {
    const html = `<div class="chat-content">
                <div class="chat-details">
                    <img src="Assets/Images/bot-icon.png" alt="" srcset="">
                    <div class="typing-animation">
                        <div class="typing-dot" style="--delay: 0.2s"></div>
                        <div class="typing-dot" style="--delay: 0.3s"></div>
                        <div class="typing-dot" style="--delay: 0.4s"></div>
                    </div>
                </div>
                <span class="material-symbols-outlined">content_copy</span>
            </div>`;    
    const outgoingChatDiv = createElement(html, "incoming");
    chatContainer.appendChild(outgoingChatDiv);

    getChatResponse();
}

const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    const html = `<div class="chat-content">
                    <div class="chat-details">
                        <img src="Assets/Images/user2.jpg" alt="" srcset="">
                        <p>${userText}</p>
                    </div>
                </div>`;    
    const outgoingChatDiv = createElement(html, "outgoing");
    chatContainer.appendChild(outgoingChatDiv);
    setTimeout(showTypingAnimation, 500);
}
sendButton.addEventListener("click", handleOutgoingChat);