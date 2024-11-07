document.addEventListener("DOMContentLoaded", function () {
    const nameInput = document.getElementById("nameInput");
    const addButton = document.getElementById("addButton");
    const drawButton = document.getElementById("drawButton");
    const nameList = document.getElementById("nameList");
    const countdownDisplay = document.getElementById("countdownDisplay");
    const winnerDisplay = document.getElementById("winnerDisplay");
    const resetButton = document.getElementById("resetButton");

    const confirmBox = document.createElement("div");
    confirmBox.classList.add("confirm-box");
    confirmBox.innerHTML = `
        <p>DESEJA PROSSEGUIR COM O SORTEIO?</p>
        <button id="confirmYes">Sim</button>
        <button id="confirmNo">Não</button>
    `;
    document.body.appendChild(confirmBox);

    const confirmYes = document.getElementById("confirmYes");
    const confirmNo = document.getElementById("confirmNo");

    let participants = JSON.parse(localStorage.getItem("participants")) || [];
    let drawInProgress = JSON.parse(localStorage.getItem("drawInProgress")) || false;
    let countdownState = localStorage.getItem("countdownDisplay") || "";
    let winnerState = localStorage.getItem("winnerDisplay") || "";

    function renderList() {
        nameList.innerHTML = "";
        participants.forEach((p, index) => {
            const listItem = document.createElement("div");
            listItem.classList.add("list-item");
            listItem.innerHTML = `
                <span>${p.name}</span>
                <span>${p.number}</span>
                <button class="delete-button" onclick="deleteParticipant(${index})">Deletar</button>
            `;
            nameList.appendChild(listItem);
        });
        localStorage.setItem("participants", JSON.stringify(participants));
    }

    addButton.addEventListener("click", () => {
        if (drawInProgress) return;
        const name = nameInput.value.trim();
        if (name && participants.length < 999) {
            const number = Math.floor(Math.random() * 999) + 1;
            participants.push({ name, number });
            renderList();
            nameInput.value = "";
        }
    });

    window.deleteParticipant = (index) => {
        participants.splice(index, 1);
        renderList();
    };

    drawButton.addEventListener("click", () => {
        if (participants.length === 0 || drawInProgress) return;
        confirmBox.style.display = "block";
    });

    confirmYes.addEventListener("click", () => {
        confirmBox.style.display = "none";
        startDraw();
    });

    confirmNo.addEventListener("click", () => {
        confirmBox.style.display = "none";
    });

    function startDraw() {
        drawInProgress = true;
        localStorage.setItem("drawInProgress", drawInProgress);

        let countdown = 10;
        countdownDisplay.innerText = `Sorteando em ${countdown}...`;
        localStorage.setItem("countdownDisplay", countdownDisplay.innerText);

        const countdownInterval = setInterval(() => {
            countdown -= 1;
            countdownDisplay.innerText = `Sorteando em ${countdown}...`;
            localStorage.setItem("countdownDisplay", countdownDisplay.innerText);

            if (countdown === 0) {
                clearInterval(countdownInterval);
                const winner = participants[Math.floor(Math.random() * participants.length)];
                winnerDisplay.innerHTML = `<span class="ven-tam">Vencedor:</span> ${winner.name} - Número: ${winner.number}`;
                localStorage.setItem("winnerDisplay", winnerDisplay.innerHTML);
                confettiEffect();
                resetButton.style.display = "block";
                localStorage.setItem("drawInProgress", false);
            }
        }, 1000);
    }

    function confettiEffect() {
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement("div");
            confetti.classList.add("confetti");
            confetti.style.left = Math.random() * 100 + "vw";
            confetti.style.top = Math.random() * -50 + "vh";
            confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }
    }

    resetButton.addEventListener("click", () => {
        participants = [];
        renderList();
        countdownDisplay.innerText = "";
        winnerDisplay.innerText = "";
        resetButton.style.display = "none";
        localStorage.clear();
    });

    renderList();
    countdownDisplay.innerText = countdownState || "";
    winnerDisplay.innerHTML = winnerState || "";
    resetButton.style.display = winnerState ? "block" : "none";
});
