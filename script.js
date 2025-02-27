document.addEventListener("DOMContentLoaded", function () {
    const nicknameInput = document.getElementById("nickname");
    const enterBtn = document.getElementById("enterBtn");
    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "center";
    buttonContainer.style.marginTop = "10px";
    buttonContainer.style.gap = "10px";
    nicknameInput.parentNode.appendChild(buttonContainer);
    
    const anonymousBtn = document.createElement("button");
    anonymousBtn.id = "anonymousBtn";
    anonymousBtn.textContent = "Хочу остаться анонимным";
    buttonContainer.appendChild(anonymousBtn);
    
    const demoBtn = document.createElement("button");
    demoBtn.id = "demoBtn";
    demoBtn.textContent = "Для демонстрации";
    buttonContainer.appendChild(demoBtn);
    
    const logoutBtn = document.createElement("button");
    logoutBtn.id = "logoutBtn";
    logoutBtn.textContent = "Выйти";
    logoutBtn.style.position = "absolute";
    logoutBtn.style.top = "10px";
    logoutBtn.style.right = "20px";
    
    const infoSection = document.getElementById("info");
    const greeting = document.getElementById("greeting");
    const actionsLog = document.getElementById("actions");
    let actions = [];

    function logAction(action) {
        actions.push(action);
        if (actions.length > 20) actions = [];
        actionsLog.textContent = actions.join(", ");
    }

    function setNickname(nickname) {
        localStorage.setItem("nickname", nickname);
        greeting.textContent = `Здравствуй, ${nickname}!`;
        document.querySelector(".container").classList.add("hidden");
        infoSection.classList.remove("hidden");
        document.body.appendChild(logoutBtn);
        displayUserInfo();
        logAction(nickname === "Аноним" ? "Пользователь остался анонимным" : "Пользователь вошёл");
    }

    enterBtn.addEventListener("click", function () {
        let nickname = nicknameInput.value.trim() || "Аноним";
        setNickname(nickname);
    });

    anonymousBtn.addEventListener("click", function () {
        setNickname("Аноним");
    });

    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("nickname");
        localStorage.removeItem("demoMode");
        location.reload();
    });

    demoBtn.addEventListener("click", function () {
        localStorage.setItem("demoMode", "true");
        document.getElementById("ip").textContent = "192.168." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255);
        setNickname("Аноним");
    });

    async function fetchIP() {
        if (localStorage.getItem("demoMode")) return;
        try {
            let response = await fetch("https://api.myip.com/");
            let data = await response.json();
            document.getElementById("ip").textContent = data.ip;
        } catch (error) {
            document.getElementById("ip").textContent = "Не удалось определить";
        }
    }

    function getBrowserInfo() {
        let userAgent = navigator.userAgent;
        if (userAgent.includes("Firefox")) return "Mozilla Firefox";
        if (userAgent.includes("Edg")) return "Microsoft Edge";
        if (userAgent.includes("Chrome")) return "Google Chrome";
        if (userAgent.includes("Safari")) return "Apple Safari";
        if (userAgent.includes("Opera") || userAgent.includes("OPR")) return "Opera";
        return "Неизвестный браузер";
    }

    function displayUserInfo() {
        fetchIP();
        document.getElementById("language").textContent = navigator.language;
        document.getElementById("timezone").textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
        document.getElementById("browser").textContent = getBrowserInfo();
        document.getElementById("os").textContent = navigator.platform;
        document.getElementById("arch").textContent = navigator.deviceMemory ? `${navigator.deviceMemory}GB` : "Неизвестно";
        document.getElementById("device").textContent = /Mobi|Android/i.test(navigator.userAgent) ? "Мобильное" : "Настольное";
        document.getElementById("screenRes").textContent = `${screen.width}x${screen.height}`;
        document.getElementById("referer").textContent = document.referrer || "Прямой вход";
        document.getElementById("performance").textContent = performance.now().toFixed(2) + " мс";
    }

    document.addEventListener("click", (event) => logAction(`Клик (${event.clientX}, ${event.clientY})`));
    document.addEventListener("keydown", () => logAction("Нажатие клавиши"));

    if (localStorage.getItem("nickname")) {
        setNickname(localStorage.getItem("nickname"));
    }
});

