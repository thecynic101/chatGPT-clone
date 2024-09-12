const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const themeButton = document.querySelector("#theme-btn");
const chatContainer = document.querySelector(".chat-container");
const deleteButton = document.querySelector("#delete-btn");


let userText = null;
const API_KEY = "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";

const loadDataFromLocalStorage = () => {
    const themeColor = localStorage.setItem("theme-color")
    
    document.body.classList.toggle("light-mode", "themeColor" === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark-mode" : "light_mode"
    chatContainer.scrollTo(0, chatContainer.scrollHeight)
    
    chatContainer.innerHTML = localStorage.getItem("all-chats")
}

const createElement= (html, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = html;
    return chatDiv;
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));


const getChatResponse = async() => {
    const API_URL = "https://api.openai.com/v1/completions";
    const pElement = document.createElement("p")

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
        const response = await (await fetch(API_URL, requestOptions)).json;
        pElement.textContent = response.choices[0].text.trim();
        // if (response.status === 429) {
        //     console.error("Too many requests. Try again later.");
        //     return;
        // }
        // const data = await response.json();
        // console.log(data);
    } catch (error) {
        pElement.classList.add("error")
        pElement.textContent = "oops! something went wrong while retrieving the response. please try again later."

        // "Error occurred:",
    }

    incomingChatDiv.querySelector(".typing-animator").remove();
    incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
    localStorage.setItem("all-chats", chatContainer.innerHTML)
    chatContainer.scrollTo(0, chatContainer.scrollHeight)

}

const copyResponse = (copyBtn) => {
    const responseTextElement = copyBtn.parentElement.querySelector("p")
    navigator.clipboard.writeText(responseTextElement.textContent)
    copyBtn.textContent = "done"
    setTimeout(() => copyBtn.textContent = "content_copy", 1000)
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
    chatInput.value = "";
}
sendButton.addEventListener("click", handleOutgoingChat);

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("theme-color", themeButton.innerText)
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark-mode" : "light_mode"
})

deleteButton.addEventListener("click", () => {
    if (confirm = ("Are you sure you want to delete all your chats?")) {
      localStorage.removeItem("all-chats");
      chatContainer.innerHTML = "";
      loadDataFromLocalStorage();
    }
  });

const initialHeight = chatInput.scrollHeight;

chatInput.addEventListener("input", (e) =>{
    chatInput.style.height = `${initialHeight}px`
    chatInput.style.height = `${chatInput.scrollHeight}px`
})
chatInput.addEventListener("keydown", () =>{
   if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault()
    handleOutgoingChat()
   }
})
