/* =====================================================
   🌸 PRIMER MES - SCRIPT PRINCIPAL
===================================================== */


/* =====================================================
   CONFIGURACIÓN
===================================================== */

const SECRET_CODE = ["A", "M", "O"];

let completedLetters = [];

let currentLevel = 1;

let currentSong = 1;

let gameRunning = false;

let animationFrame;


/* =====================================================
   IMÁGENES
===================================================== */

const novioImg = new Image();

novioImg.src = "novio-removebg-preview.png";


const yoImg = new Image();

yoImg.src = "yo-removebg-preview.png";


/* =====================================================
   🎵 AUDIO
===================================================== */

/*
   Los MP3 se colocan directamente en:

   audio/
   ├── noche-de-los-dos.mp3
   ├── se-me-antoja.mp3
   └── sexto-sentido.mp3

   La música está definida directamente
   en el HTML mediante <audio>.

   Este código solamente sirve para pausar
   cualquier canción cuando se cambia de sección.
*/


function pauseAllMusic(){

    const audios =
        document.querySelectorAll("audio");


    audios.forEach(audio => {

        audio.pause();

    });

}


/* =====================================================
   FONDO DE PÉTALOS
===================================================== */

function createBackgroundPetals(){

    const container =
        document.getElementById("petalBackground");


    if(!container){

        return;

    }


    for(let i = 0; i < 35; i++){

        const petal =
            document.createElement("div");


        petal.className =
            "petal";


        petal.textContent =
            Math.random() > .5
            ? "🌸"
            : "✿";


        petal.style.left =
            Math.random() * 100 + "%";


        petal.style.animationDuration =
            (6 + Math.random() * 8) + "s";


        petal.style.animationDelay =
            (-Math.random() * 10) + "s";


        petal.style.fontSize =
            (10 + Math.random() * 15) + "px";


        container.appendChild(petal);

    }

}


createBackgroundPetals();


/* =====================================================
   🌸 NAVEGACIÓN
===================================================== */

function hideSections(){

    document
        .querySelectorAll(".section")
        .forEach(section => {

            section.classList.remove("active");

        });

}


function showSection(id){

    /*
       ⏸️ PAUSAR TODA LA MÚSICA
       cada vez que cambiamos de sección.
    */

    pauseAllMusic();


    hideSections();


    const section =
        document.getElementById(id);


    if(section){

        section.classList.add("active");


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }

}


/* =====================================================
   🎮 MOSTRAR JUEGO
===================================================== */

function showGame(){

    pauseAllMusic();

    showSection("game");

    startGame();

}


/* =====================================================
   🎵 MOSTRAR CANCIONES
===================================================== */

function showSongs(){

    pauseAllMusic();

    showSection("songs");

    showSong(currentSong);

}


/* =====================================================
   💌 MOSTRAR CARTA
===================================================== */

function showLetter(){

    if(completedLetters.length < 3){

        showToast(
            "🔐 Primero completa los 3 niveles."
        );

        return;

    }


    pauseAllMusic();

    showSection("unlock");

}


/* =====================================================
   🎮 MOTOR DEL JUEGO
===================================================== */

const canvas =
    document.getElementById("gameCanvas");


const ctx =
    canvas.getContext("2d");


const GAME_WIDTH = 1000;

const GAME_HEIGHT = 560;

const gravity = 0.7;


/* =====================================================
   CONTROLES
===================================================== */

const keys = {

    left: false,

    right: false,

    jump: false

};


/* =====================================================
   JUGADOR
===================================================== */

const player = {

    x: 80,

    y: 400,

    width: 60,

    height: 90,

    vx: 0,

    vy: 0,

    speed: 5,

    jumpPower: 14,

    grounded: false

};


/* =====================================================
   ENEMIGO
===================================================== */

const enemy = {

    x: 820,

    y: 400,

    width: 60,

    height: 90,

    speed: 1.5

};


/* =====================================================
   NIVELES
===================================================== */

const levels = [

    {

        letter: "A",

        enemySpeed: 1.35,

        petals: [

            {x: 180, y: 420},

            {x: 350, y: 350},

            {x: 520, y: 420},

            {x: 690, y: 330},

            {x: 850, y: 420}

        ],

        platforms: [

            {
                x: 0,
                y: 490,
                width: 1000,
                height: 70
            },

            {
                x: 270,
                y: 410,
                width: 150,
                height: 20
            },

            {
                x: 470,
                y: 340,
                width: 150,
                height: 20
            },

            {
                x: 650,
                y: 410,
                width: 150,
                height: 20
            }

        ]

    },


    {

        letter: "M",

        enemySpeed: 1.75,

        petals: [

            {x: 120, y: 420},

            {x: 300, y: 330},

            {x: 500, y: 420},

            {x: 700, y: 280},

            {x: 880, y: 400}

        ],

        platforms: [

            {
                x: 0,
                y: 490,
                width: 1000,
                height: 70
            },

            {
                x: 180,
                y: 410,
                width: 140,
                height: 20
            },

            {
                x: 370,
                y: 350,
                width: 140,
                height: 20
            },

            {
                x: 580,
                y: 300,
                width: 150,
                height: 20
            },

            {
                x: 780,
                y: 410,
                width: 130,
                height: 20
            }

        ]

    },


    {

        letter: "O",

        enemySpeed: 2.1,

        petals: [

            {x: 100, y: 420},

            {x: 280, y: 300},

            {x: 470, y: 400},

            {x: 680, y: 260},

            {x: 900, y: 360}

        ],

        platforms: [

            {
                x: 0,
                y: 490,
                width: 1000,
                height: 70
            },

            {
                x: 140,
                y: 400,
                width: 130,
                height: 20
            },

            {
                x: 320,
                y: 340,
                width: 130,
                height: 20
            },

            {
                x: 500,
                y: 410,
                width: 130,
                height: 20
            },

            {
                x: 650,
                y: 300,
                width: 140,
                height: 20
            },

            {
                x: 830,
                y: 390,
                width: 120,
                height: 20
            }

        ]

    }

];


let currentLevelData;


/* =====================================================
   INICIAR NIVEL
===================================================== */

function startGame(){

    currentLevelData =
        levels[currentLevel - 1];


    gameRunning = true;


    document.getElementById(
        "levelNumber"
    ).textContent =
        currentLevel;


    document.getElementById(
        "hudLevel"
    ).textContent =
        currentLevel;


    document.getElementById(
        "petalTotal"
    ).textContent =
        currentLevelData.petals.length;


    document.getElementById(
        "petalCount"
    ).textContent =
        "0";


    resetPositions();


    document
        .getElementById("levelOverlay")
        .classList.add("hidden");


    document
        .getElementById("gameOverOverlay")
        .classList.add("hidden");


    cancelAnimationFrame(
        animationFrame
    );


    gameLoop();

}


/* =====================================================
   REINICIAR POSICIONES
===================================================== */

function resetPositions(){

    player.x = 70;


    player.y =
        490 - player.height;


    player.vx = 0;

    player.vy = 0;

    player.grounded = true;


    enemy.x = 850;


    enemy.y =
        490 - enemy.height;

}


/* =====================================================
   ⌨️ TECLADO
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if(
            event.code === "ArrowLeft" ||
            event.code === "KeyA"
        ){

            keys.left = true;

        }


        if(
            event.code === "ArrowRight" ||
            event.code === "KeyD"
        ){

            keys.right = true;

        }


        if(
            event.code === "Space" ||
            event.code === "ArrowUp" ||
            event.code === "KeyW"
        ){

            keys.jump = true;

            event.preventDefault();

        }

    }
);


document.addEventListener(
    "keyup",
    event => {

        if(
            event.code === "ArrowLeft" ||
            event.code === "KeyA"
        ){

            keys.left = false;

        }


        if(
            event.code === "ArrowRight" ||
            event.code === "KeyD"
        ){

            keys.right = false;

        }


        if(
            event.code === "Space" ||
            event.code === "ArrowUp" ||
            event.code === "KeyW"
        ){

            keys.jump = false;

        }

    }
);


/* =====================================================
   📱 CONTROLES CELULAR
===================================================== */

function mobileButton(button, key){

    const element =
        document.getElementById(button);


    if(!element){

        return;

    }


    element.addEventListener(
        "touchstart",
        event => {

            event.preventDefault();

            keys[key] = true;

        }
    );


    element.addEventListener(
        "touchend",
        event => {

            event.preventDefault();

            keys[key] = false;

        }
    );


    element.addEventListener(
        "touchcancel",
        event => {

            event.preventDefault();

            keys[key] = false;

        }
    );

}


mobileButton(
    "leftBtn",
    "left"
);


mobileButton(
    "rightBtn",
    "right"
);


mobileButton(
    "jumpBtn",
    "jump"
);


/* =====================================================
   💥 COLISIÓN
===================================================== */

function isColliding(a, b){

    return (

        a.x <
        b.x + b.width &&

        a.x + a.width >
        b.x &&

        a.y <
        b.y + b.height &&

        a.y + a.height >
        b.y

    );

}


/* =====================================================
   🏃 FÍSICA DEL JUGADOR
===================================================== */

function updatePlayer(){

    const previousBottom =
        player.y +
        player.height;


    if(keys.left){

        player.vx =
            -player.speed;

    }

    else if(keys.right){

        player.vx =
            player.speed;

    }

    else{

        player.vx *= 0.75;

    }


    if(
        keys.jump &&
        player.grounded
    ){

        player.vy =
            -player.jumpPower;

        player.grounded =
            false;

    }


    player.vy += gravity;

    player.x += player.vx;

    player.y += player.vy;


    /* LIMITES */

    if(player.x < 0){

        player.x = 0;

    }


    if(
        player.x +
        player.width >
        GAME_WIDTH
    ){

        player.x =
            GAME_WIDTH -
            player.width;

    }


    player.grounded = false;


    /* PLATAFORMAS */

    for(
        const platform
        of currentLevelData.platforms
    ){

        const currentBottom =
            player.y +
            player.height;


        if(

            previousBottom <=
            platform.y &&

            currentBottom >=
            platform.y &&

            player.x +
            player.width >
            platform.x &&

            player.x <
            platform.x +
            platform.width &&

            player.vy >= 0

        ){

            player.y =
                platform.y -
                player.height;


            player.vy = 0;


            player.grounded =
                true;

        }

    }


    /* CAÍDA */

    if(
        player.y >
        GAME_HEIGHT
    ){

        resetPositions();

    }

}


/* =====================================================
   😈 ENEMIGO
===================================================== */

function updateEnemy(){

    const speed =
        currentLevelData.enemySpeed;


    if(
        enemy.x <
        player.x - 10
    ){

        enemy.x += speed;

    }

    else if(
        enemy.x >
        player.x + 10
    ){

        enemy.x -= speed;

    }


    enemy.y =
        490 -
        enemy.height;


    if(
        isColliding(
            player,
            enemy
        )
    ){

        gameOver();

    }

}


/* =====================================================
   🌸 PÉTALOS
===================================================== */

function collectPetals(){

    for(
        let i =
        currentLevelData.petals.length - 1;

        i >= 0;

        i--

    ){

        const petal =
            currentLevelData.petals[i];


        const petalBox = {

            x:
                petal.x - 18,

            y:
                petal.y - 18,

            width: 36,

            height: 36

        };


        if(
            isColliding(
                player,
                petalBox
            )
        ){

            currentLevelData.petals
                .splice(i, 1);


            const count =
                levels[currentLevel - 1]
                .originalPetals.length -
                currentLevelData.petals.length;


            document.getElementById(
                "petalCount"
            ).textContent =
                count;


            showToast(
                "🌸 ¡PÉTALO CONSEGUIDO!"
            );


            if(
                currentLevelData.petals
                    .length === 0
            ){

                finishLevel();

            }

        }

    }

}


/* =====================================================
   💥 GAME OVER
===================================================== */

function gameOver(){

    gameRunning = false;


    document
        .getElementById(
            "gameOverOverlay"
        )
        .classList.remove("hidden");

}


/* =====================================================
   🔄 REINICIAR NIVEL
===================================================== */

function restartLevel(){

    const level =
        levels[currentLevel - 1];


    level.petals =
        level.originalPetals.map(
            petal => ({
                ...petal
            })
        );


    startGame();

}


/* =====================================================
   🏆 COMPLETAR NIVEL
===================================================== */

function finishLevel(){

    gameRunning = false;


    const letter =
        currentLevelData.letter;


    if(
        !completedLetters
            .includes(letter)
    ){

        completedLetters.push(
            letter
        );

    }


    document.getElementById(
        "letterCount"
    ).textContent =
        completedLetters.length;


    document.getElementById(
        "secretLetter"
    ).textContent =
        letter;


    document.getElementById(
        "levelCompleteText"
    ).textContent =
        `Esta es la letra ${completedLetters.length} de 3. Guarda bien este secreto ♡`;


    document
        .getElementById(
            "levelOverlay"
        )
        .classList.remove("hidden");

}


/* =====================================================
   🎵 IR A CANCIÓN
===================================================== */

function goToSong(){

    pauseAllMusic();


    currentSong =
        currentLevel;


    showSection("songs");


    showSong(currentSong);

}


/* =====================================================
   🎵 MOSTRAR CANCIÓN
===================================================== */

function showSong(number){

    currentSong =
        number;


    /*
       Nos aseguramos de que no quede
       ninguna canción sonando.
    */

    pauseAllMusic();


    for(
        let i = 1;
        i <= 3;
        i++
    ){

        const card =
            document.getElementById(
                "songCard" + i
            );


        const progress =
            document.getElementById(
                "songProgress" + i
            );


        if(card){

            card.classList.add(
                "hidden-song"
            );

        }


        if(progress){

            progress.classList.remove(
                "active"
            );

        }

    }


    const selectedCard =
        document.getElementById(
            "songCard" + number
        );


    const selectedProgress =
        document.getElementById(
            "songProgress" + number
        );


    if(selectedCard){

        selectedCard.classList.remove(
            "hidden-song"
        );

    }


    if(selectedProgress){

        selectedProgress.classList.add(
            "active"
        );

    }


    const button =
        document.getElementById(
            "nextSongButton"
        );


    if(button){

        if(number < 3){

            button.textContent =
                "CONTINUAR AL SIGUIENTE NIVEL ♡";

        }

        else{

            button.textContent =
                "DESBLOQUEAR LA CARTA 💌";

        }

    }

}


/* =====================================================
   ➡️ CONTINUAR DESDE CANCIÓN
===================================================== */

function continueFromSong(){

    /*
       ⏸️ Pausar la canción antes
       de cambiar de sección.
    */

    pauseAllMusic();


    if(currentSong < 3){

        currentLevel++;


        showGame();

    }

    else{

        showSection("unlock");

    }

}


/* =====================================================
   🔐 CÓDIGO SECRETO
===================================================== */

function setupCodeInputs(){

    const inputs = [

        document.getElementById("code1"),

        document.getElementById("code2"),

        document.getElementById("code3")

    ];


    inputs.forEach(
        (input, index) => {

            if(!input){

                return;

            }


            input.addEventListener(
                "input",
                () => {

                    input.value =
                        input.value
                        .toUpperCase()
                        .replace(
                            /[^A-Z]/g,
                            ""
                        );


                    if(
                        input.value &&
                        inputs[index + 1]
                    ){

                        inputs[index + 1]
                            .focus();

                    }

                }
            );


            input.addEventListener(
                "keydown",
                event => {

                    if(
                        event.key ===
                        "Backspace" &&

                        !input.value &&

                        inputs[index - 1]
                    ){

                        inputs[index - 1]
                            .focus();

                    }

                }
            );

        }
    );

}


setupCodeInputs();


/* =====================================================
   🔓 COMPROBAR CÓDIGO
===================================================== */

function checkCode(){

    if(
        completedLetters.length < 3
    ){

        document.getElementById(
            "codeMessage"
        ).textContent =
            "🔐 Todavía faltan niveles por completar.";

        return;

    }


    const code = [

        document.getElementById(
            "code1"
        ).value,

        document.getElementById(
            "code2"
        ).value,

        document.getElementById(
            "code3"
        ).value

    ];


    const correct =
        code.every(
            (letter, index) =>
                letter ===
                SECRET_CODE[index]
        );


    if(correct){

        document.getElementById(
            "codeMessage"
        ).textContent =
            "💗 Código correcto...";


        setTimeout(() => {

            showSection("letter");

        }, 1000);

    }

    else{

        document.getElementById(
            "codeMessage"
        ).textContent =
            "❌ Ese no es el código... intenta recordar las letras.";


        document.getElementById(
            "codeMessage"
        ).style.color =
            "#e64a7b";

    }

}


/* =====================================================
   💗 FINAL
===================================================== */

function startFinale(){

    /*
       Por si alguna canción estuviera sonando,
       la detenemos antes del final.
    */

    pauseAllMusic();


    const overlay =
        document.getElementById(
            "finalOverlay"
        );


    overlay.classList.remove(
        "hidden"
    );


    const characters =
        document.querySelector(
            ".final-characters"
        );


    const heart =
        document.getElementById(
            "kissHeart"
        );


    const message =
        document.getElementById(
            "finalMessage"
        );


    characters.classList.remove(
        "approach"
    );


    heart.classList.remove(
        "show"
    );


    message.classList.remove(
        "show"
    );


    /*
       LOS PERSONAJES ENTRAN
    */

    setTimeout(() => {

        characters.classList.add(
            "approach"
        );

    }, 300);


    /*
       CORAZÓN / BESO
    */

    setTimeout(() => {

        heart.classList.add(
            "show"
        );

    }, 2300);


    /*
       MENSAJE FINAL
    */

    setTimeout(() => {

        message.classList.add(
            "show"
        );

    }, 3500);

}


/* =====================================================
   💬 TOAST
===================================================== */

let toastTimeout;


function showToast(message){

    const toast =
        document.getElementById(
            "toast"
        );


    if(!toast){

        return;

    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimeout
    );


    toastTimeout =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 1800);

}


/* =====================================================
   🌄 DIBUJAR FONDO DEL JUEGO
===================================================== */

function drawGameBackground(){

    /* CIELO */

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            GAME_HEIGHT
        );


    gradient.addColorStop(
        0,
        "#d9c8ff"
    );


    gradient.addColorStop(
        0.5,
        "#ffd7eb"
    );


    gradient.addColorStop(
        1,
        "#fff0d9"
    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );


    /* LUNA */

    ctx.beginPath();


    ctx.arc(
        820,
        90,
        48,
        0,
        Math.PI * 2
    );


    ctx.fillStyle =
        "rgba(255,255,255,.8)";


    ctx.fill();


    /* NUBES */

    drawCloud(
        100,
        100,
        1
    );


    drawCloud(
        400,
        140,
        0.7
    );


    /* MONTAÑAS */

    ctx.fillStyle =
        "rgba(160,110,180,.25)";


    ctx.beginPath();


    ctx.moveTo(
        0,
        490
    );


    ctx.lineTo(
        180,
        310
    );


    ctx.lineTo(
        330,
        490
    );


    ctx.lineTo(
        500,
        300
    );


    ctx.lineTo(
        700,
        490
    );


    ctx.lineTo(
        830,
        330
    );


    ctx.lineTo(
        1000,
        490
    );


    ctx.closePath();


    ctx.fill();


    /* ÁRBOLES */

    drawSakuraTree(
        70,
        480,
        1.1
    );


    drawSakuraTree(
        900,
        480,
        0.9
    );

}


/* =====================================================
   ☁️ NUBES
===================================================== */

function drawCloud(
    x,
    y,
    scale
){

    ctx.save();


    ctx.translate(
        x,
        y
    );


    ctx.scale(
        scale,
        scale
    );


    ctx.fillStyle =
        "rgba(255,255,255,.65)";


    ctx.beginPath();


    ctx.arc(
        0,
        20,
        30,
        0,
        Math.PI * 2
    );


    ctx.arc(
        35,
        10,
        40,
        0,
        Math.PI * 2
    );


    ctx.arc(
        75,
        25,
        30,
        0,
        Math.PI * 2
    );


    ctx.fill();


    ctx.restore();

}


/* =====================================================
   🌸 ÁRBOL SAKURA
===================================================== */

function drawSakuraTree(
    x,
    y,
    scale
){

    ctx.save();


    ctx.translate(
        x,
        y
    );


    ctx.scale(
        scale,
        scale
    );


    /* TRONCO */

    ctx.fillStyle =
        "#76505b";


    ctx.fillRect(
        -15,
        -170,
        30,
        170
    );


    /* RAMAS */

    ctx.strokeStyle =
        "#76505b";


    ctx.lineWidth =
        12;


    ctx.beginPath();


    ctx.moveTo(
        0,
        -100
    );


    ctx.lineTo(
        -70,
        -170
    );


    ctx.moveTo(
        0,
        -120
    );


    ctx.lineTo(
        70,
        -190
    );


    ctx.stroke();


    /* FLORES */

    const flowers = [

        [-90, -180],

        [-50, -220],

        [0, -240],

        [60, -220],

        [100, -175],

        [-20, -180],

        [30, -190]

    ];


    flowers.forEach(
        ([fx, fy]) => {

            drawFlower(
                fx,
                fy,
                20
            );

        }
    );


    ctx.restore();

}


/* =====================================================
   🌸 FLORES
===================================================== */

function drawFlower(
    x,
    y,
    size
){

    for(
        let i = 0;
        i < 5;
        i++
    ){

        const angle =
            i *
            Math.PI *
            2 /
            5;


        const px =
            x +
            Math.cos(angle) *
            size *
            0.55;


        const py =
            y +
            Math.sin(angle) *
            size *
            0.55;


        ctx.beginPath();


        ctx.arc(
            px,
            py,
            size * 0.45,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
            "#ff91c5";


        ctx.fill();

    }


    ctx.beginPath();


    ctx.arc(
        x,
        y,
        size * 0.28,
        0,
        Math.PI * 2
    );


    ctx.fillStyle =
        "#ffd45f";


    ctx.fill();

}


/* =====================================================
   🪵 PLATAFORMAS
===================================================== */

function drawPlatforms(){

    currentLevelData
        .platforms
        .forEach(
            platform => {

                const isGround =
                    platform.y >= 480;


                /* TIERRA */

                ctx.fillStyle =
                    isGround
                    ? "#c48a72"
                    : "#9b6f82";


                ctx.fillRect(
                    platform.x,
                    platform.y,
                    platform.width,
                    platform.height
                );


                /* HIERBA */

                ctx.fillStyle =
                    "#78ad76";


                ctx.fillRect(
                    platform.x,
                    platform.y,
                    platform.width,
                    8
                );


                /* FLORES */

                for(
                    let x =
                        platform.x + 15;

                    x <
                        platform.x +
                        platform.width;

                    x += 50
                ){

                    drawFlower(
                        x,
                        platform.y - 4,
                        7
                    );

                }

            }
        );

}


/* =====================================================
   🌸 PÉTALOS DEL JUEGO
===================================================== */

function drawGamePetals(){

    currentLevelData
        .petals
        .forEach(
            petal => {

                drawFlower(
                    petal.x,
                    petal.y,
                    13
                );

            }
        );

}


/* =====================================================
   👩‍❤️‍👨 PERSONAJES
===================================================== */

function drawImageContain(
    image,
    x,
    y,
    width,
    height
){

    if(
        !image.complete ||
        image.naturalWidth === 0
    ){

        /* FALLBACK */

        ctx.fillStyle =
            "#ff72b6";


        ctx.fillRect(
            x,
            y,
            width,
            height
        );


        return;

    }


    const scale =
        Math.min(
            width /
            image.naturalWidth,

            height /
            image.naturalHeight
        );


    const drawWidth =
        image.naturalWidth *
        scale;


    const drawHeight =
        image.naturalHeight *
        scale;


    const drawX =
        x +
        (
            width -
            drawWidth
        ) / 2;


    const drawY =
        y +
        (
            height -
            drawHeight
        ) / 2;


    ctx.drawImage(
        image,
        drawX,
        drawY,
        drawWidth,
        drawHeight
    );

}


function drawCharacters(){

    /* NOVIO */

    drawImageContain(
        novioImg,
        player.x,
        player.y,
        player.width,
        player.height
    );


    /* YO */

    drawImageContain(
        yoImg,
        enemy.x,
        enemy.y,
        enemy.width,
        enemy.height
    );

}


/* =====================================================
   🎮 GAME LOOP
===================================================== */

function gameLoop(){

    if(!gameRunning){

        drawEverything();

        return;

    }


    updatePlayer();

    updateEnemy();

    collectPetals();

    drawEverything();


    animationFrame =
        requestAnimationFrame(
            gameLoop
        );

}


/* =====================================================
   🎨 DIBUJAR TODO
===================================================== */

function drawEverything(){

    ctx.clearRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );


    drawGameBackground();

    drawPlatforms();

    drawGamePetals();

    drawCharacters();

}


/* =====================================================
   🌸 COPIAR PÉTALOS ORIGINALES
===================================================== */

levels.forEach(
    level => {

        level.originalPetals =
            level.petals.map(
                petal => ({
                    ...petal
                })
            );

    }
);


/* =====================================================
   🔄 REPARAR PÉTALOS AL INICIAR
===================================================== */

const originalStartGame =
    startGame;


startGame =
    function(){

        const level =
            levels[currentLevel - 1];


        level.petals =
            level.originalPetals.map(
                petal => ({
                    ...petal
                })
            );


        originalStartGame();

    };


/* =====================================================
   🚀 INICIAL
===================================================== */

showSection("home");