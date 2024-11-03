document.addEventListener("DOMContentLoaded", function () {
    const nameInput = document.getElementById("nameInput");
    const addButton = document.getElementById("addButton");
    const drawButton = document.getElementById("drawButton");
    const nameList = document.getElementById("nameList");
    const countdownDisplay = document.getElementById("countdownDisplay");
    const winnerDisplay = document.getElementById("winnerDisplay");
    const resetButton = document.getElementById("resetButton");

    let participants = JSON.parse(localStorage.getItem("participants")) || [];
    let drawInProgress = JSON.parse(localStorage.getItem("drawInProgress")) || false;
    let countdownState = localStorage.getItem("countdownDisplay") || "";
    let winnerState = localStorage.getItem("winnerDisplay") || "";

    // Função para exibir participantes na lista
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

    // Função para adicionar participante
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

    // Função para deletar participante
    window.deleteParticipant = (index) => {
        participants.splice(index, 1);
        renderList();
    };

    // Função para sortear com contagem regressiva
    drawButton.addEventListener("click", () => {
        if (participants.length === 0 || drawInProgress) return;

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
                localStorage.setItem("winnerDisplay", winnerDisplay.innerText);
                confettiEffect();
                resetButton.style.display = "block";
                drawInProgress = false;
                localStorage.setItem("drawInProgress", drawInProgress);
            }
        }, 1000);
    });

// Função para gerar confete mais aleatoriamente espalhado pela tela
function confettiEffect() {
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");

        // Posicionamento aleatório e estilo
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.top = Math.random() * -50 + "vh"; // Faz com que comecem a "cair" do topo da tela
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;

        document.body.appendChild(confetti);

        // Remover confetes após animação
        setTimeout(() => confetti.remove(), 3000);
    }
}

    // Resetar o sistema
    resetButton.addEventListener("click", () => {
        participants = [];
        renderList();
        countdownDisplay.innerText = "";
        winnerDisplay.innerText = "";
        resetButton.style.display = "none";
        localStorage.removeItem("participants");
        localStorage.removeItem("countdownDisplay");
        localStorage.removeItem("winnerDisplay");
        localStorage.removeItem("drawInProgress");
    });

    // Carregar estado inicial
    renderList();
    countdownDisplay.innerText = countdownState;
    winnerDisplay.innerText = winnerState;
    resetButton.style.display = winnerState ? "block" : "none";
});
