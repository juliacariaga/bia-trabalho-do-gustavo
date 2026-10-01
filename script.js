 

let board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];


const player = "player";

const computer = "computer";


let gameOver = false;

let playerTurn = true;




let level =
    Number(
        localStorage.getItem(
            "battleLevel"
        )
    ) || 1;


let wins =
    Number(
        localStorage.getItem(
            "battleWins"
        )
    ) || 0;


let losses =
    Number(
        localStorage.getItem(
            "battleLosses"
        )
    ) || 0;


let playerSkin =
    localStorage.getItem(
        "playerSkin"
    ) || "🥷";




const boardElement =
    document.getElementById(
        "board"
    );


const statusElement =
    document.getElementById(
        "status"
    );


const levelElement =
    document.getElementById(
        "level"
    );


const winsElement =
    document.getElementById(
        "wins"
    );


const lossesElement =
    document.getElementById(
        "losses"
    );


const progressElement =
    document.getElementById(
        "progress"
    );


const playerAvatar =
    document.getElementById(
        "playerAvatar"
    );


const enemyAvatar =
    document.getElementById(
        "enemyAvatar"
    );


const enemyName =
    document.getElementById(
        "enemyName"
    );


const difficulty =
    document.getElementById(
        "difficulty"
    );


const skinSelect =
    document.getElementById(
        "skin"
    );


const message =
    document.getElementById(
        "message"
    );


const messageTitle =
    document.getElementById(
        "messageTitle"
    );


const messageText =
    document.getElementById(
        "messageText"
    );


 

const enemies = [

    {
        avatar: "🤖",
        name: "ROBÔ INICIANTE",
        difficulty: "Fácil"
    },

    {
        avatar: "👹",
        name: "DEMÔNIO",
        difficulty: "Normal"
    },

    {
        avatar: "🧟",
        name: "ZUMBI",
        difficulty: "Difícil"
    },

    {
        avatar: "👾",
        name: "ALIEN",
        difficulty: "Muito difícil"
    },

    {
        avatar: "💀",
        name: "CHEFE FINAL",
        difficulty: "Insano"
    }

];


 

const winningCombinations = [

    [0, 1, 2],

    [3, 4, 5],

    [6, 7, 8],

    [0, 3, 6],

    [1, 4, 7],

    [2, 5, 8],

    [0, 4, 8],

    [2, 4, 6]

];


 
function saveProgress() {

    localStorage.setItem(
        "battleLevel",
        level
    );


    localStorage.setItem(
        "battleWins",
        wins
    );


    localStorage.setItem(
        "battleLosses",
        losses
    );


    localStorage.setItem(
        "playerSkin",
        playerSkin
    );
}


 
function updateInterface() {

    levelElement.textContent =
        level;


    winsElement.textContent =
        wins;


    lossesElement.textContent =
        losses;


     
    const progress =
        ((level - 1) % 5) * 20;


    progressElement.style.width =
        (
            progress === 0 &&
            level > 1
                ? 100
                : progress
        ) + "%";


 

    const enemyIndex =
        Math.min(
            Math.floor(
                (level - 1) / 2
            ),
            enemies.length - 1
        );


    const enemy =
        enemies[enemyIndex];


    enemyAvatar.textContent =
        enemy.avatar;


    enemyName.textContent =
        enemy.name;


    difficulty.textContent =
        enemy.difficulty;


    playerAvatar.textContent =
        playerSkin;


    skinSelect.value =
        playerSkin;
}


 
function getEnemyAvatar() {

    const enemyIndex =
        Math.min(
            Math.floor(
                (level - 1) / 2
            ),
            enemies.length - 1
        );


    return enemies[
        enemyIndex
    ].avatar;
}
 
function renderBoard() {

    const cells =
        document.querySelectorAll(
            ".cell"
        );


    cells.forEach(
        (cell, index) => {
 

            cell.innerHTML = "";


            
            cell.classList.remove(
                "occupied"
            );


            cell.classList.remove(
                "winning"
            );

 

            if (
                board[index]
            ) {

                cell.classList.add(
                    "occupied"
                );


                const fighter =
                    document.createElement(
                        "span"
                    );


                fighter.className =
                    "fighter";


                // Personagem do jogador

                if (
                    board[index] === player
                ) {

                    fighter.textContent =
                        playerSkin;

                }

                

                else {

                    fighter.textContent =
                        getEnemyAvatar();
                }


                cell.appendChild(
                    fighter
                );
            }
        }
    );
}


 

function setupBoard() {

    const cells =
        document.querySelectorAll(
            ".cell"
        );


    cells.forEach(
        cell => {

            cell.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            cell.dataset.index
                        );


                    playerMove(
                        index
                    );
                }
            );
        }
    );
}

 

function playerMove(index) {

    if (
        gameOver ||
        !playerTurn ||
        board[index] !== ""
    ) {

        return;
    }


    // Coloca jogador

    board[index] =
        player;

 

    renderBoard();


    

    createEffect(
        index,
        "💣"
    );


     
    checkGame();


 
    if (!gameOver) {

        playerTurn = false;


        statusElement.textContent =
            "O inimigo está atacando...";


        setTimeout(
            computerMove,
            700
        );
    }
}

 
  
function computerMove() {

    if (gameOver) {
        return;
    }


    const move =
        findBestMove();


    if (
        move !== -1
    ) {

        board[move] =
            computer;


        renderBoard();


        
        createEffect(
            move,
            level >= 5
                ? "🔥"
                : "💥"
        );


        checkGame();
    }


    if (!gameOver) {

        playerTurn = true;


        statusElement.textContent =
            "Sua vez! Ataque!";
    }
}

 
function findBestMove() {

    const empty = [];


    board.forEach(
        (cell, index) => {

            if (
                cell === ""
            ) {

                empty.push(
                    index
                );
            }
        }
    );


    if (
        empty.length === 0
    ) {

        return -1;
    }


    // Quanto maior o nível,
    // mais inteligente o inimigo

    const intelligence =
        Math.min(
            0.25 +
            level * 0.12,
            0.95
        );


    // Tentar ganhar

    if (
        Math.random()
        < intelligence
    ) {

        const winningMove =
            findWinningMove(
                computer
            );


        if (
            winningMove !== -1
        ) {

            return winningMove;
        }
    }


    // Tentar bloquear

    if (
        Math.random()
        < intelligence
    ) {

        const blockingMove =
            findWinningMove(
                player
            );


        if (
            blockingMove !== -1
        ) {

            return blockingMove;
        }
    }


    // Centro

    if (
        board[4] === "" &&
        Math.random()
        < intelligence
    ) {

        return 4;
    }


    // Cantos

    const corners = [
        0,
        2,
        6,
        8
    ];


    const availableCorners =
        corners.filter(
            index =>
                board[index] === ""
        );


    if (
        availableCorners.length &&
        Math.random()
        < intelligence
    ) {

        return availableCorners[
            Math.floor(
                Math.random()
                *
                availableCorners.length
            )
        ];
    }


    // Movimento aleatório

    return empty[
        Math.floor(
            Math.random()
            *
            empty.length
        )
    ];
}


 

function findWinningMove(symbol) {

    for (
        const combo
        of winningCombinations
    ) {

        const values =
            combo.map(
                index =>
                    board[index]
            );


        const symbolCount =
            values.filter(
                value =>
                    value === symbol
            ).length;


        const emptyCount =
            values.filter(
                value =>
                    value === ""
            ).length;


        if (
            symbolCount === 2 &&
            emptyCount === 1
        ) {

            return combo.find(
                index =>
                    board[index] === ""
            );
        }
    }


    return -1;
}


 

function checkGame() {

    const winner =
        getWinner();


    // Existe vencedor

    if (winner) {

        gameOver = true;


        highlightWinner(
            winner.combo
        );


     
        if (
            winner.symbol === player
        ) {

            wins++;

            level++;


            saveProgress();

            updateInterface();


            showMessage(
                "🏆 VITÓRIA!",
                `
                Você derrotou o inimigo!

                <br><br>

                ⭐ Você chegou ao
                <b>nível ${level}</b>!

                <br><br>

                🔥 A próxima batalha
                será mais difícil!
                `
            );
        }


      
        else {

            losses++;


            saveProgress();

            updateInterface();


            showMessage(
                "💀 DERROTA!",
                `
                O inimigo venceu
                esta batalha.

                <br><br>

                ⚔️ Seu nível continua
                em <b>${level}</b>.

                <br><br>

                Tente novamente!
                `
            );
        }


        return;
    }


 

    if (
        !board.includes("")
    ) {

        gameOver = true;


        showMessage(
            "🤝 EMPATE!",
            `
            Nenhum guerreiro
            conseguiu vencer.

            <br><br>

            Prepare-se para
            outra batalha!
            `
        );
    }
}


 
function getWinner() {

    for (
        const combo
        of winningCombinations
    ) {

        const [
            a,
            b,
            c
        ] = combo;


        if (
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            return {

                symbol:
                    board[a],

                combo:
                    combo

            };
        }
    }


    return null;
}

 
function highlightWinner(
    combo
) {

    combo.forEach(
        index => {

            const cell =
                document.querySelector(
                    `.cell[data-index="${index}"]`
                );


            if (cell) {

                cell.classList.add(
                    "winning"
                );
            }
        }
    );
}


 
function createEffect(
    index,
    emoji
) {

    const cell =
        document.querySelector(
            `.cell[data-index="${index}"]`
        );


    if (!cell) {
        return;
    }


    const effect =
        document.createElement(
            "div"
        );


    effect.className =
        "battle-effect";


    effect.textContent =
        emoji;


    cell.appendChild(
        effect
    );


    setTimeout(
        () => {

            effect.remove();

        },
        800
    );
}


 

function newGame() {

    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];


    gameOver = false;


    playerTurn = true;


    statusElement.textContent =
        "Sua vez! Ataque o inimigo!";


    renderBoard();
}


 
function changeSkin() {

    playerSkin =
        skinSelect.value;


    saveProgress();


    updateInterface();


    renderBoard();
}


 
function showMessage(
    title,
    text
) {

    messageTitle.textContent =
        title;


    messageText.innerHTML =
        text;


    message.style.display =
        "flex";
}


 

function closeMessage() {

    message.style.display =
        "none";


    newGame();
}


 
function resetProgress() {

    const confirmReset =
        confirm(
            "Tem certeza que deseja apagar seu nível, vitórias e derrotas?"
        );


    if (!confirmReset) {
        return;
    }


    level = 1;

    wins = 0;

    losses = 0;


    saveProgress();


    updateInterface();


    newGame();
}


 
 

document
    .getElementById(
        "newGameButton"
    )
    .addEventListener(
        "click",
        newGame
    );


document
    .getElementById(
        "resetButton"
    )
    .addEventListener(
        "click",
        resetProgress
    );


document
    .getElementById(
        "continueButton"
    )
    .addEventListener(
        "click",
        closeMessage
    );


skinSelect.addEventListener(
    "change",
    changeSkin
);


 
setupBoard();

updateInterface();

renderBoard();
