document.addEventListener("DOMContentLoaded", function () {
    const nameInput = document.getElementById("nameInput");
    const addButton = document.getElementById("addButton");
    const drawButton = document.getElementById("drawButton");
    const nameList = document.getElementById("nameList");
    const countdownDisplay = document.getElementById("countdownDisplay");
    const winnerDisplay = document.getElementById("winnerDisplay");
    const resetButton = document.getElementById("resetButton");
    const searchInput = document.getElementById("searchInput");

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

    const resetConfirmBox = document.createElement("div");
    resetConfirmBox.classList.add("confirm-box");
    resetConfirmBox.innerHTML = `
        <p>DESEJA RESETAR A PÁGINA DE SORTEIO?</p>
        <button id="resetConfirmYes">Sim</button>
        <button id="resetConfirmNo">Não</button>
    `;
    document.body.appendChild(resetConfirmBox);

    const resetConfirmYes = document.getElementById("resetConfirmYes");
    const resetConfirmNo = document.getElementById("resetConfirmNo");

    let participants = JSON.parse(localStorage.getItem("participants")) || [];
    let drawInProgress = JSON.parse(localStorage.getItem("drawInProgress")) || false;
    let countdownState = localStorage.getItem("countdownDisplay") || "";
    let winnerState = localStorage.getItem("winnerDisplay") || "";
    let resetButtonState = JSON.parse(localStorage.getItem("resetButtonState")) || false;
    let buttonsDisabledState = JSON.parse(localStorage.getItem("buttonsDisabledState")) || false;

    function renderList(filteredParticipants = participants) {
        nameList.innerHTML = "";
        filteredParticipants.forEach((p, index) => {
            const listItem = document.createElement("div");
            listItem.classList.add("list-item");
            listItem.innerHTML = `
                <span>${p.name}</span>
                <span>${p.number}</span>
                <button class="delete-button" onclick="deleteParticipant(${index})" ${buttonsDisabledState ? 'disabled' : ''}>Deletar</button>
            `;
            nameList.appendChild(listItem);
        });
        localStorage.setItem("participants", JSON.stringify(participants));
    }

    function disableButtons() {
        addButton.disabled = true;
        drawButton.disabled = true;
        nameInput.disabled = true;
        const deleteButtons = document.querySelectorAll(".delete-button");
        deleteButtons.forEach(button => button.disabled = true);
    }

    function enableButtons() {
        addButton.disabled = false;
        drawButton.disabled = false;
        nameInput.disabled = false;
        const deleteButtons = document.querySelectorAll(".delete-button");
        deleteButtons.forEach(button => button.disabled = false);
    }

    function addParticipant() {
        if (drawInProgress) return;
        const name = nameInput.value.trim();
        if (name && participants.length < 999) {
            const number = Math.floor(Math.random() * 999) + 1;
            participants.push({ name, number });
            renderList();
            nameInput.value = "";
        }
    }

    // Evento para adicionar com o botão
    addButton.addEventListener("click", addParticipant);

    // Evento para adicionar com Enter
    nameInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            addParticipant();
        }
    });

    window.deleteParticipant = (index) => {
        if (drawInProgress) return;
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
        countdownDisplay.innerText = `Sorteando em 10...`;
        localStorage.setItem("countdownDisplay", countdownDisplay.innerText);

        disableButtons();
        localStorage.setItem("buttonsDisabledState", true);

        let countdown = 10;
        const countdownInterval = setInterval(() => {
            countdown -= 1;
            countdownDisplay.innerText = `Sorteando em ${countdown}...`;

            if (countdown === 0) {
                clearInterval(countdownInterval);
                const winner = participants[Math.floor(Math.random() * participants.length)];
                winnerDisplay.innerHTML = `<span class="ven-tam">Vencedor:</span> ${winner.name} - Número: ${winner.number}`;
                localStorage.setItem("winnerDisplay", winnerDisplay.innerHTML);
                confettiEffect();
                resetButton.style.display = "block";
                localStorage.setItem("resetButtonState", true);
                drawInProgress = false;
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
        resetConfirmBox.style.display = "block";
    });

    resetConfirmYes.addEventListener("click", () => {
        participants = [];
        renderList();
        countdownDisplay.innerText = "";
        winnerDisplay.innerText = "";
        resetButton.style.display = "none";
        localStorage.clear();
        enableButtons();
        localStorage.setItem("buttonsDisabledState", false);
        localStorage.setItem("resetButtonState", false);
        resetConfirmBox.style.display = "none";
    });

    resetConfirmNo.addEventListener("click", () => {
        resetConfirmBox.style.display = "none";
    });

    // Pesquisa automática enquanto digita
    searchInput.addEventListener("input", () => {
        const searchQuery = searchInput.value.trim().toLowerCase();
        const filteredParticipants = participants.filter(p => 
            p.name.toLowerCase().includes(searchQuery)
        );
        renderList(filteredParticipants);
    });

    // Renderização inicial
    renderList();
    countdownDisplay.innerText = countdownState || "";
    winnerDisplay.innerHTML = winnerState || "";

    if (resetButtonState) {
        resetButton.style.display = "block";
    } else {
        resetButton.style.display = "none";
    }

    if (buttonsDisabledState) {
        disableButtons();
    }
});