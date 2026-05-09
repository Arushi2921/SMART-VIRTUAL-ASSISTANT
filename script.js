let botName = localStorage.getItem("botName") || "ChatBot";
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
let reminders = JSON.parse(localStorage.getItem("reminders") || "[]");
let hasWelcomedChat = false;

const dictionary = {
    hello: "A greeting or expression of goodwill.",
    programming: "The process of designing and building executable computer software to accomplish a specific task.",
    motivation: "The reason or reasons one has for acting or behaving in a particular way.",
    ai: "Technology that enables machines to mimic human intelligence.",
    blockchain: "A decentralized and secure digital ledger technology.",
    cybersecurity: "Protecting systems and data from cyber threats.",
    cloudcomputing: "Using remote servers for data storage and computing power.",
    encryption: "Converting data into a secure, unreadable format.",
    ml: "A subset of AI that enables systems to learn from data.",
    metaverse: "A virtual universe combining augmented and virtual reality."
};

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveReminders() {
    localStorage.setItem("reminders", JSON.stringify(reminders));
}

function addOutput(containerId, html) {
    const output = document.getElementById(containerId);
    output.insertAdjacentHTML("beforeend", html);
    output.scrollTop = output.scrollHeight;
}

function escapeHtml(text) {
    const span = document.createElement("span");
    span.textContent = text;
    return span.innerHTML;
}

function addChatMessage(sender, message, type = "bot") {
    const output = document.getElementById("chat-output");
    const safeSender = escapeHtml(sender);
    const safeMessage = escapeHtml(message);

    output.insertAdjacentHTML("beforeend", `
        <div class="chat-message ${type}">
            <span class="chat-sender">${safeSender}</span>
            <p>${safeMessage}</p>
        </div>
    `);
    output.scrollTop = output.scrollHeight;
}

function addBotHtml(html) {
    const output = document.getElementById("chat-output");

    output.insertAdjacentHTML("beforeend", `
        <div class="chat-message bot">
            <span class="chat-sender">${escapeHtml(botName)}</span>
            <div>${html}</div>
        </div>
    `);
    output.scrollTop = output.scrollHeight;
}

function showSection(sectionName) {
    document.getElementById("main-menu").style.display = "none";
    document.querySelectorAll(".chatbot-section, .todo-section, .search-section, .reminder-section, .calculator-section").forEach((section) => {
        section.classList.remove("active");
        section.style.display = "";
    });

    document.getElementById(`${sectionName}-section`).classList.add("active");

    if (sectionName === "chatbot" && !hasWelcomedChat) {
        hasWelcomedChat = true;
        addChatMessage(botName, "Hello! You can type messages here. Try: hi, date, meaning of computer, calculate 5 * 8, or search weather today.");
    }
}

function showMainMenu() {
    document.getElementById("main-menu").style.display = "grid";
    document.querySelectorAll(".chatbot-section, .todo-section, .search-section, .reminder-section, .calculator-section, #calc-section").forEach((section) => {
        section.classList.remove("active");
        section.style.display = "none";
    });
}

function getDateTime() {
    const now = new Date();
    addChatMessage(botName, `Current Date & Time: ${now.toLocaleString()}`);
}

function greetUser() {
    const greetings = [
        "Hi there! How can I help you today?",
        "Hello! How can I assist you today?",
        "Hey! What can I do for you today?",
        "I am ready. What should we work on?"
    ];
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    addChatMessage(botName, greeting);
}

function showCalculator() {
    document.getElementById("chatbot-section").style.display = "none";
    document.getElementById("calc-section").style.display = "block";
}

function hideCalculator() {
    document.getElementById("calc-section").style.display = "none";
    document.getElementById("chatbot-section").style.display = "block";
}

function getCalculation(num1Id, opId, num2Id) {
    const num1 = parseFloat(document.getElementById(num1Id).value);
    const num2 = parseFloat(document.getElementById(num2Id).value);
    const op = document.getElementById(opId).value;

    if (Number.isNaN(num1) || Number.isNaN(num2)) {
        return "Please enter valid numbers.";
    }

    switch (op) {
        case "+":
            return num1 + num2;
        case "-":
            return num1 - num2;
        case "*":
            return num1 * num2;
        case "/":
            return num2 === 0 ? "Error! Division by zero." : num1 / num2;
        default:
            return "Invalid operation.";
    }
}

function calculateInChat() {
    const result = getCalculation("calc-num1", "calc-op", "calc-num2");
    document.getElementById("calc-result-chat").innerHTML = `<p>Result: ${result}</p>`;
}

async function showDictionary() {
    const word = prompt("Enter any English word to look up:");
    if (!word) {
        return;
    }

    const lowerWord = word.trim().toLowerCase();
    if (!lowerWord) {
        return;
    }

    addChatMessage(botName, `Searching meaning for "${lowerWord}"...`);
    await lookupDictionary(lowerWord);
}

async function lookupDictionary(word) {
    const lowerWord = word.trim().toLowerCase();

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(lowerWord)}`);

        if (!response.ok) {
            throw new Error("Word not found");
        }

        const data = await response.json();
        const entry = data[0];
        const phonetic = entry.phonetic ? ` <em>${escapeHtml(entry.phonetic)}</em>` : "";
        const meanings = entry.meanings
            .slice(0, 3)
            .map((meaning) => {
                const definition = escapeHtml(meaning.definitions[0]?.definition || "No definition available.");
                const exampleText = meaning.definitions[0]?.example;
                const example = exampleText ? `<br><small>Example: ${escapeHtml(exampleText)}</small>` : "";
                return `<li><strong>${escapeHtml(meaning.partOfSpeech)}:</strong> ${definition}${example}</li>`;
            })
            .join("");

        addBotHtml(`
            <p><strong>${escapeHtml(entry.word)}</strong>${phonetic}</p>
            <ul>${meanings}</ul>
        `);
    } catch (error) {
        const fallback = dictionary[lowerWord];
        const message = fallback
            ? `${lowerWord}: ${fallback}`
            : `Sorry, I could not find a meaning for "${lowerWord}". Please check your spelling or internet connection.`;
        addChatMessage(botName, message);
    }
}

function changeBotName() {
    const newName = prompt("Enter a new name for me:");
    if (!newName || !newName.trim()) {
        return;
    }

    botName = newName.trim();
    localStorage.setItem("botName", botName);
    addChatMessage(botName, `Great! My new name is ${botName}.`);
}

function findDictionaryWord(message) {
    const patterns = [
        /^meaning of\s+(.+)$/i,
        /^define\s+(.+)$/i,
        /^dictionary\s+(.+)$/i,
        /^what is the meaning of\s+(.+)$/i
    ];

    for (const pattern of patterns) {
        const match = message.match(pattern);
        if (match) {
            return match[1].trim();
        }
    }

    return "";
}

function findSearchQuery(message) {
    const match = message.match(/^search\s+(.+)$/i);
    return match ? match[1].trim() : "";
}

function calculateFromMessage(message) {
    const expression = message.replace(/^calculate\s+/i, "").trim();
    const match = expression.match(/^(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)$/);

    if (!match) {
        return "";
    }

    const num1 = Number.parseFloat(match[1]);
    const op = match[2];
    const num2 = Number.parseFloat(match[3]);

    if (op === "/" && num2 === 0) {
        return "Error! Division by zero.";
    }

    const result = {
        "+": num1 + num2,
        "-": num1 - num2,
        "*": num1 * num2,
        "/": num1 / num2
    }[op];

    return `${expression} = ${result}`;
}

async function sendChatMessage() {
    const chatInput = document.getElementById("chat-input");
    const message = chatInput.value.trim();

    if (!message) {
        return;
    }

    addChatMessage("You", message, "user");
    chatInput.value = "";

    const lowerMessage = message.toLowerCase();
    const dictionaryWord = findDictionaryWord(message);
    const searchQuery = findSearchQuery(message);
    const calculation = calculateFromMessage(message);

    if (["hi", "hello", "hey"].includes(lowerMessage)) {
        greetUser();
    } else if (lowerMessage.includes("date") || lowerMessage.includes("time")) {
        getDateTime();
    } else if (dictionaryWord) {
        addChatMessage(botName, `Searching meaning for "${dictionaryWord}"...`);
        await lookupDictionary(dictionaryWord);
    } else if (calculation) {
        addChatMessage(botName, calculation);
    } else if (searchQuery) {
        addChatMessage(botName, `Opening search results for "${searchQuery}".`);
        window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, "_blank", "noopener");
    } else if (lowerMessage.includes("your name")) {
        addChatMessage(botName, `My name is ${botName}.`);
    } else if (lowerMessage === "help") {
        addChatMessage(botName, "You can ask for date/time, word meanings, simple calculations like calculate 12 / 4, or searches like search JavaScript tutorial.");
    } else {
        addChatMessage(botName, "I can help with greetings, date/time, dictionary meanings, simple calculations, and web searches. Type help to see examples.");
    }
}

function addTask() {
    const taskInput = document.getElementById("task-input");
    const task = taskInput.value.trim();

    if (!task) {
        return;
    }

    tasks.push({ description: task, completed: false });
    taskInput.value = "";
    saveTasks();
    renderTasks();
}

function renderTasks() {
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.innerHTML = "<li>No tasks yet.</li>";
        return;
    }

    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        if (task.completed) {
            li.classList.add("completed");
        }

        const description = document.createElement("span");
        description.textContent = task.description;

        const actions = document.createElement("div");
        actions.className = "task-actions";
        actions.innerHTML = `
            <button onclick="completeTask(${index})">${task.completed ? "Done" : "Complete"}</button>
            <button onclick="deleteTask(${index})">Delete</button>
        `;

        li.append(description, actions);
        taskList.appendChild(li);
    });
}

function completeTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function performSearch() {
    const query = document.getElementById("search-input").value.trim();
    if (!query) {
        return;
    }

    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank", "noopener");
}

function addReminder() {
    const messageInput = document.getElementById("reminder-message");
    const timeInput = document.getElementById("reminder-time");
    const message = messageInput.value.trim();
    const seconds = Number.parseInt(timeInput.value, 10);

    if (!message || Number.isNaN(seconds) || seconds <= 0) {
        addOutput("reminder-output", "<p>Please enter a reminder message and a positive number of seconds.</p>");
        return;
    }

    const reminder = {
        id: Date.now(),
        message,
        reminderTime: Date.now() + seconds * 1000
    };

    reminders.push(reminder);
    saveReminders();
    scheduleReminder(reminder);
    renderReminders();

    messageInput.value = "";
    timeInput.value = "";
}

function scheduleReminder(reminder) {
    const delay = reminder.reminderTime - Date.now();

    if (delay <= 0) {
        triggerReminder(reminder);
        return;
    }

    setTimeout(() => triggerReminder(reminder), delay);
}

function triggerReminder(reminder) {
    alert(`Reminder: ${reminder.message}`);
    reminders = reminders.filter((item) => item.id !== reminder.id);
    saveReminders();
    renderReminders();
}

function renderReminders() {
    const output = document.getElementById("reminder-output");

    if (reminders.length === 0) {
        output.innerHTML = "<p>No reminders set.</p>";
        return;
    }

    output.innerHTML = reminders
        .map((reminder) => {
            const time = new Date(reminder.reminderTime).toLocaleTimeString();
            return `<p>Reminder set: "${reminder.message}" at ${time}</p>`;
        })
        .join("");
}

function calculate() {
    const result = getCalculation("num1", "operation", "num2");
    document.getElementById("calc-result").innerHTML = `<p>Result: ${result}</p>`;
}

document.addEventListener("DOMContentLoaded", () => {
    renderTasks();
    renderReminders();
    reminders.forEach(scheduleReminder);

    document.getElementById("task-input").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            addTask();
        }
    });

    document.getElementById("search-input").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            performSearch();
        }
    });

    document.getElementById("chat-input").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            sendChatMessage();
        }
    });
});
