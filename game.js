// Game State
let gameState = {
    level: 1,
    moves: 0,
    stress: 0,
    empathy: 100,
    activeEvent: 'normal',
    pieces: [],
    selectedPiece: null,
    dragStart: { x: 0, y: 0 },
    initialPiecePos: { x: 0, y: 0 }
};

const GRID_SIZE = 6;
const CELL_SIZE_PCT = 100 / GRID_SIZE;

// Level Definitions
const LEVELS = [
    {
        num: 1,
        title: "Primeira Travessia",
        description: "Abra caminho para o pedestre utilizando os espaços livres.",
        target: { x: 5, y: 3 }, // Grid coords
        zecaMessage: "Mova os carros para abrir caminho. Atenção: deixe espaço de segurança à frente e atrás do carro!",
        event: { id: 'normal', title: 'Fluxo Normal', desc: 'Dia ensolarado. Tráfego padrão.', icon: 'ri-sun-line' },
        pieces: [
            { id: 'ped1', type: 'pedestrian', x: 0, y: 3, size: 1, isMain: true },
            { id: 'car1', type: 'car', x: 2, y: 1, orient: 'V', size: 2, color: 'linear-gradient(135deg, #ff416c, #ff4b2b)', icon: 'ri-walk-line' },
            { id: 'car2', type: 'car', x: 3, y: 3, orient: 'V', size: 2, color: 'linear-gradient(135deg, #4776E6, #8E54E9)' }
        ]
    },
    {
        num: 2,
        title: "Desafio do Ônibus",
        description: "O fluxo coletivo exige mais espaço e paciência.",
        target: { x: 3, y: 5 },
        zecaMessage: "O ônibus responde por 40 pessoas! Prioridade máxima na travessia.",
        event: { id: 'rain', title: 'Dia de Chuva', desc: 'Pista escorregadia. Distância de segurança dobrada!', icon: 'ri-rainy-line' },
        pieces: [
            { id: 'bus1', type: 'bus', x: 3, y: 1, orient: 'V', size: 3, isMain: true, color: 'linear-gradient(135deg, #f9d423, #ff4e50)' },
            { id: 'car3', type: 'car', x: 1, y: 3, orient: 'H', size: 2, color: 'linear-gradient(135deg, #11998e, #38ef7d)' },
            { id: 'car4', type: 'car', x: 3, y: 4, orient: 'H', size: 2, color: 'linear-gradient(135deg, #F00000, #DC281E)' }
        ]
    },
    {
        num: 3,
        title: "Operação Pista Limpa",
        description: "Reestabeleça a conexão da via movendo os entulhos.",
        target: { x: 5, y: 3 },
        zecaMessage: "Epa! Estrada interrompida! Pedestres e ciclistas passam pela ponte holográfica, mas carros estão bloqueados.",
        event: { id: 'maintenance', title: 'Pista Limpa', desc: 'Reparo na pista. Proibido parar na junção.', icon: 'ri-hammer-line' },
        isBroken: true,
        pieces: [
            { id: 'ped2', type: 'pedestrian', x: 0, y: 2, size: 1, isMain: true },
            { id: 'deb1', type: 'debris', x: 2, y: 2, size: 1, color: 'linear-gradient(135deg, #444, #666)' },
            { id: 'deb2', type: 'debris', x: 3, y: 3, size: 1, color: 'linear-gradient(135deg, #444, #666)' },
            { id: 'car5', type: 'car', x: 2, y: 0, orient: 'V', size: 2, color: 'linear-gradient(135deg, #FF0099, #493240)' },
            { id: 'car6', type: 'car', x: 3, y: 4, orient: 'H', size: 2, color: 'linear-gradient(135deg, #11998e, #38ef7d)' }
        ]
    }
];

// DOM Elements
const gridContainer = document.getElementById('game-grid');
const moveCountEl = document.getElementById('move-count');
const stressValueEl = document.getElementById('stress-value');
const stressProgressEl = document.getElementById('stress-progress');
const empathyScoreEl = document.getElementById('empathy-score');
const zecaMessageEl = document.getElementById('zeca-message');
const zecaVisualEl = document.getElementById('zeca-visual');
const levelNumberEl = document.getElementById('level-number');
const eventTitleEl = document.getElementById('event-title');
const eventDescEl = document.getElementById('event-desc');
const eventIconEl = document.getElementById('event-icon');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');

const overlayEl = document.getElementById('game-overlay');
const modalTitleEl = document.getElementById('modal-title');
const modalDescEl = document.getElementById('modal-desc');
const modalStarsEl = document.getElementById('modal-stars');
const modalActionBtn = document.getElementById('modal-action-btn');

// Initialize
function init() {
    loadLevel(gameState.level);
    setupEvents();
}

function loadLevel(levelNum) {
    const lvl = LEVELS.find(l => l.num === levelNum);
    if (!lvl) return;

    gameState.pieces = JSON.parse(JSON.stringify(lvl.pieces)); // deep copy
    gameState.moves = 0;
    gameState.stress = 0;
    gameState.empathy = 100;
    gameState.activeEvent = lvl.event.id;

    // Update UI
    levelNumberEl.textContent = String(levelNum).padStart(2, '0');
    zecaMessageEl.textContent = lvl.zecaMessage;
    eventTitleEl.textContent = lvl.event.title;
    eventDescEl.textContent = lvl.event.desc;
    eventIconEl.innerHTML = `<i class="${lvl.event.icon}"></i>`;
    
    updateHUD();
    renderGridBackground();
    renderPieces();
}

function renderGridBackground() {
    gridContainer.innerHTML = '';
    // Create background cells
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.x = c;
            cell.dataset.y = r;
            
            // Highlight target cell
            const lvl = LEVELS.find(l => l.num === gameState.level);
            
            // Fenda/Broken Grid aesthetics
            if (lvl && lvl.isBroken && (r === 2 || r === 3)) {
                cell.style.background = 'rgba(255, 68, 68, 0.05)';
                cell.style.borderTop = r === 2 ? '1px dashed rgba(255, 68, 68, 0.4)' : '';
                cell.style.borderBottom = r === 3 ? '1px dashed rgba(255, 68, 68, 0.4)' : '';
            }

            if (lvl && lvl.target.x === c && lvl.target.y === r) {
                cell.style.background = 'rgba(0, 255, 136, 0.15)';
                cell.style.borderColor = 'var(--neon-green)';
                cell.style.borderStyle = 'solid';
                cell.innerHTML = '<i class="ri-flag-2-line" style="color:var(--neon-green); font-size: 1.2rem; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></i>';
            }
            gridContainer.appendChild(cell);
        }
    }
}

function renderPieces() {
    // Remove existing pieces (but keep backgrid)
    const existing = gridContainer.querySelectorAll('.piece');
    existing.forEach(e => e.remove());

    gameState.pieces.forEach(p => {
        const div = document.createElement('div');
        div.className = `piece piece-${p.type}`;
        div.id = p.id;
        div.style.background = p.color;
        
        // Size and position calculated from grid
        const width = p.orient === 'H' ? p.size : 1;
        const height = p.orient === 'V' ? p.size : 1;
        
        div.style.width = `calc(${width * CELL_SIZE_PCT}% - 8px)`;
        div.style.height = `calc(${height * CELL_SIZE_PCT}% - 8px)`;
        div.style.left = `calc(${p.x * CELL_SIZE_PCT}% + 4px)`;
        div.style.top = `calc(${p.y * CELL_SIZE_PCT}% + 4px)`;

        // Icon inside
        if (p.type === 'pedestrian') div.innerHTML = '<i class="ri-walk-line"></i>';
        if (p.type === 'cyclist') div.innerHTML = '<i class="ri-riding-line"></i>';
        if (p.type === 'bus') div.innerHTML = '<i class="ri-bus-line"></i>';
        if (p.type === 'car') div.innerHTML = '<i class="ri-car-fill"></i>';
        if (p.type === 'debris') div.innerHTML = '<i class="ri-pulse-line"></i>';

        if (p.isMain) {
            div.style.boxShadow = `0 0 15px 4px var(--neon-green)`;
        }

        // Event listener for dragging
        div.addEventListener('mousedown', (e) => startDrag(e, p));
        div.addEventListener('touchstart', (e) => startDrag(e, p));

        gridContainer.appendChild(div);
    });
}

function startDrag(e, piece) {
    e.preventDefault();
    gameState.selectedPiece = piece;
    const clientX = e.clientX || e.touches[0].clientX;
    const clientY = e.clientY || e.touches[0].clientY;
    
    gameState.dragStart = { x: clientX, y: clientY };
    gameState.initialPiecePos = { x: piece.x, y: piece.y };

    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchmove', dragMove);
    document.addEventListener('touchend', endDrag);

    // Dynamic dialogue
    zecaMessageEl.textContent = "Ajuste a posição com cuidado. Menos stress = mais estrelas!";
}

function dragMove(e) {
    if (!gameState.selectedPiece) return;
    const p = gameState.selectedPiece;
    const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);

    const deltaX = clientX - gameState.dragStart.x;
    const deltaY = clientY - gameState.dragStart.y;

    const rect = gridContainer.getBoundingClientRect();
    const cellW = rect.width / GRID_SIZE;
    const cellH = rect.height / GRID_SIZE;

    const moveX = Math.round(deltaX / cellW);
    const moveY = Math.round(deltaY / cellH);

    let targetX = gameState.initialPiecePos.x;
    let targetY = gameState.initialPiecePos.y;

    // Constrain by Axis for vehicles
    if (p.type === 'pedestrian' || p.type === 'cyclist' || p.type === 'debris') {
        targetX = gameState.initialPiecePos.x + moveX;
        targetY = gameState.initialPiecePos.y + moveY;
    } else if (p.orient === 'H') {
        targetX = gameState.initialPiecePos.x + moveX;
    } else if (p.orient === 'V') {
        targetY = gameState.initialPiecePos.y + moveY;
    }

    // Border constraints
    targetX = Math.max(0, Math.min(GRID_SIZE - (p.orient === 'H' ? p.size : 1), targetX));
    targetY = Math.max(0, Math.min(GRID_SIZE - (p.orient === 'V' ? p.size : 1), targetY));

    // Continuous visual update
    const el = document.getElementById(p.id);
    if (el) {
        el.style.left = `calc(${targetX * CELL_SIZE_PCT}% + 4px)`;
        el.style.top = `calc(${targetY * CELL_SIZE_PCT}% + 4px)`;
    }

    // Temporarily save to check path collision or just save position for validation on drop?
    // In traditional Rush Hour, dragging blocks when it hits something.
    // Simplifying: we only snap and check on drop to penalize stress.
    gameState._tempX = targetX;
    gameState._tempY = targetY;
    
    // Safety Zone highlights (Blue glow)
    highlightSafetyZones(p, targetX, targetY);
}

function endDrag() {
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('mouseup', endDrag);
    document.removeEventListener('touchmove', dragMove);
    document.removeEventListener('touchend', endDrag);

    const p = gameState.selectedPiece;
    if (!p) return;

    const finalX = gameState._tempX !== undefined ? gameState._tempX : p.x;
    const finalY = gameState._tempY !== undefined ? gameState._tempY : p.y;

    // Check collisions and rules
    const isValid = validateMove(p, finalX, finalY);

    if (isValid) {
        if (p.x !== finalX || p.y !== finalY) {
            p.x = finalX;
            p.y = finalY;
            gameState.moves += 1;
            zecaMessageEl.textContent = "Movimento seguro! O fluxo avança.";

            // Special: update broken status for Level 3
            const lvl = LEVELS.find(l => l.num === gameState.level);
            if (lvl && lvl.isBroken && p.type === 'debris') {
                const stillBroken = gameState.pieces.some(o => o.type === 'debris' && (o.y === 2 || o.y === 3));
                if (!stillBroken) {
                    zecaMessageEl.textContent = "Pista conectada! Laser do Zeca agora brilha VERDE. Fluxo liberado.";
                    document.querySelectorAll('.grid-cell').forEach(c => {
                        const cellY = parseInt(c.dataset.y);
                        if (cellY === 2 || cellY === 3) {
                            c.style.background = 'rgba(0, 255, 136, 0.08)';
                            c.style.borderTop = '1px solid rgba(0, 255, 136, 0.3)';
                        }
                    });
                }
            }
        }
    } else {
        // Invalid move snaps back
        p.x = gameState.initialPiecePos.x;
        p.y = gameState.initialPiecePos.y;
        addStress(15, "Movimento bloqueado ou viola zona de segurança!");
    }

    gameState.selectedPiece = null;
    gameState._tempX = undefined;
    gameState._tempY = undefined;

    clearHighlights();
    renderPieces();
    updateHUD();
    checkWinCondition();
}

function validateMove(piece, curX, curY) {
    // 1. Collision Check against bound or OTHER PIECES
    const overlapping = gameState.pieces.some(o => {
        if (o.id === piece.id) return false;
        return checkOverlap(
            { x: curX, y: curY, size: piece.size, orient: piece.orient, type: piece.type },
            o
        );
    });

    if (overlapping) return false;

    // 1b. Broken Grid Logic (Operação Pista Limpa)
    const lvl = LEVELS.find(l => l.num === gameState.level);
    if (lvl && lvl.isBroken) {
        const isBrokenState = gameState.pieces.some(o => o.type === 'debris' && (o.y === 2 || o.y === 3));
        
        if (isBrokenState) {
            if (piece.type === 'car' || piece.type === 'bus') {
                const overlapsGap = (piece.orient === 'V') ? 
                    (curY <= 3 && curY + piece.size - 1 >= 2) : 
                    (curY === 2 || curY === 3);
                
                if (overlapsGap) {
                    zecaMessageEl.textContent = "A fenda está aberta! Remova os entulhos para liberar os carros.";
                    return false;
                }
            }
        } else {
            // Check for stopping on junction
            if ((piece.type === 'car' || piece.type === 'bus') && piece.orient === 'V' && curY === 2) {
                zecaMessageEl.textContent = "Proibido parar sobre a emenda da pista!";
                return false;
            }
        }
    }

    // 2. Safety Zone Check (Zeca Farol Rule)
    // "Nenhum veículo motorizado pode terminar seu movimento ocupando o quadrado imediatamente à frente ou atrás de outro elemento."
    if (piece.type === 'car' || piece.type === 'bus') {
        const isSafe = checkSafetyDistance(piece, curX, curY);
        if (!isSafe) {
            return false; // Violates safety
        }
    }

    return true;
}

function checkOverlap(p1, p2) {
    const w1 = p1.orient === 'H' ? p1.size : 1;
    const h1 = p1.orient === 'V' ? p1.size : 1;
    const w2 = p2.orient === 'H' ? p2.size : 1;
    const h2 = p2.orient === 'V' ? p2.size : 1;

    return (p1.x < p2.x + w2 &&
            p1.x + w1 > p2.x &&
            p1.y < p2.y + h2 &&
            p1.y + h1 > p2.y);
}

function checkSafetyDistance(piece, curX, curY) {
    let safetyRadius = 1;
    if (gameState.activeEvent === 'rain') safetyRadius = 2; // Event: Rain doubles distance

    let checkCoords = [];
    if (piece.orient === 'H') {
        for (let r = 1; r <= safetyRadius; r++) {
            checkCoords.push({ x: curX - r, y: curY }); // Backwards
            checkCoords.push({ x: curX + piece.size - 1 + r, y: curY }); // Forwards
        }
    } else if (piece.orient === 'V') {
        for (let r = 1; r <= safetyRadius; r++) {
            checkCoords.push({ x: curX, y: curY - r }); // Backwards (Up)
            checkCoords.push({ x: curX, y: curY + piece.size - 1 + r }); // Forwards (Down)
        }
    }

    // Check if any coords contain another element
    for (let c of checkCoords) {
        if (c.x >= 0 && c.x < GRID_SIZE && c.y >= 0 && c.y < GRID_SIZE) {
            const hasElement = gameState.pieces.some(o => {
                if (o.id === piece.id) return false;
                // is within o bounds
                const ow = o.orient === 'H' ? o.size : 1;
                const oh = o.orient === 'V' ? o.size : 1;
                return c.x >= o.x && c.x < o.x + ow && c.y >= o.y && c.y < o.y + oh;
            });
            if (hasElement) return false; // Violated
        }
    }
    return true;
}

function highlightSafetyZones(piece, curX, curY) {
    clearHighlights();
    // Re-draw grid to highlight potential safety squares for piece
    if (piece.type === 'car' || piece.type === 'bus') {
        let safetyRadius = 1;
        if (gameState.activeEvent === 'rain') safetyRadius = 2;

        let checkCoords = [];
        if (piece.orient === 'H') {
            for (let r = 1; r <= safetyRadius; r++) {
                checkCoords.push({ x: curX - r, y: curY });
                checkCoords.push({ x: curX + piece.size - 1 + r, y: curY });
            }
        } else {
            for (let r = 1; r <= safetyRadius; r++) {
                checkCoords.push({ x: curX, y: curY - r });
                checkCoords.push({ x: curX, y: curY + piece.size - 1 + r });
            }
        }

        checkCoords.forEach(c => {
            if (c.x >= 0 && c.x < GRID_SIZE && c.y >= 0 && c.y < GRID_SIZE) {
                const cell = gridContainer.querySelector(`.grid-cell[data-x="${c.x}"][data-y="${c.y}"]`);
                if (cell) {
                    cell.classList.add('highlight-safe');
                }
            }
        });
    }
}

function clearHighlights() {
    const cells = gridContainer.querySelectorAll('.grid-cell');
    cells.forEach(c => c.classList.remove('highlight-safe'));
}

function addStress(amount, message) {
    gameState.stress = Math.min(100, gameState.stress + amount);
    gameState.empathy = Math.max(0, 100 - gameState.stress);
    if (message) zecaMessageEl.textContent = message;
    
    // Update Zeca visual state
    const ledEyes = document.querySelectorAll('.eye');
    const redLight = document.querySelector('.light.red');
    const yellowLight = document.querySelector('.light.yellow');
    const greenLight = document.querySelector('.light.green');

    document.querySelectorAll('.light').forEach(l => l.classList.remove('active'));

    if (gameState.stress >= 90) {
        redLight.classList.add('active');
        ledEyes.forEach(e => e.style.background = 'var(--neon-red)');
    } else if (gameState.stress >= 50) {
        yellowLight.classList.add('active');
        ledEyes.forEach(e => e.style.background = 'var(--neon-yellow)');
    } else {
        greenLight.classList.add('active');
        ledEyes.forEach(e => e.style.background = 'var(--neon-blue)');
    }

    if (gameState.stress >= 100) {
        gameOver();
    }
    updateHUD();
}

function updateHUD() {
    moveCountEl.textContent = gameState.moves;
    stressValueEl.textContent = `${gameState.stress}%`;
    stressProgressEl.style.width = `${gameState.stress}%`;
    empathyScoreEl.textContent = `${gameState.empathy}%`;

    // Dynamic Star rating
    const stars = document.querySelectorAll('#star-rating i');
    stars.forEach((s, idx) => {
        if (gameState.empathy > 80 && idx < 3) s.classList.add('active');
        else if (gameState.empathy > 50 && idx < 2) s.classList.add('active');
        else if (gameState.empathy > 20 && idx < 1) s.classList.add('active');
        else s.classList.remove('active');
    });
}

function checkWinCondition() {
    const lvl = LEVELS.find(l => l.num === gameState.level);
    if (!lvl) return;

    const mainPiece = gameState.pieces.find(p => p.isMain);
    if (!mainPiece) return;

    if (mainPiece.x === lvl.target.x && mainPiece.y === lvl.target.y) {
        showWinModal();
    }
}

function showWinModal() {
    overlayEl.style.display = 'flex';
    modalTitleEl.textContent = "Fase Concluída!";
    modalDescEl.textContent = `Você guiou ${gameState.level === 2 ? 'o Ônibus' : 'o Pedestre'} com empatia.`;
    
    let starCount = 1;
    if (gameState.empathy > 80) starCount = 3;
    else if (gameState.empathy > 50) starCount = 2;

    modalStarsEl.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const star = document.createElement('i');
        star.className = i < starCount ? 'ri-star-fill' : 'ri-star-line';
        star.style.color = i < starCount ? 'var(--neon-yellow)' : 'rgba(255,255,255,0.1)';
        modalStarsEl.appendChild(star);
    }

    modalActionBtn.textContent = gameState.level < LEVELS.length ? "Próxima Fase" : "Jogar Novamente";
    modalActionBtn.onclick = () => {
        overlayEl.style.display = 'none';
        if (gameState.level < LEVELS.length) {
            gameState.level++;
        } else {
            gameState.level = 1;
        }
        loadLevel(gameState.level);
    };
}

function gameOver() {
    overlayEl.style.display = 'flex';
    modalTitleEl.textContent = "Nó no Trânsito!";
    modalDescEl.textContent = "O stress atingiu 100%. Trafégo congestionado.";
    modalStarsEl.innerHTML = '<i class="ri-close-circle-fill" style="color:var(--neon-red); font-size:3rem;"></i>';
    modalActionBtn.textContent = "Tentar Novamente";
    modalActionBtn.onclick = () => {
        overlayEl.style.display = 'none';
        loadLevel(gameState.level);
    };
}

function setupEvents() {
    startBtn.onclick = () => {
        startBtn.style.display = 'none';
        zecaMessageEl.textContent = "Fase iniciada! Mova os carros arrastando correspondendo ao eixo.";
        // Trigger gameplay sound toggle or start gameplay loop if any
    };

    restartBtn.onclick = () => {
        loadLevel(gameState.level);
    };
}

// Start Game
init();
