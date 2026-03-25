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
        description: "Abra caminho para o carro principal atravessar os espaços livres.",
        target: { x: 5, y: 3 },
        zecaMessage: "Mova os veículos no seu eixo para abrir caminho ao Carro Vermelho!",
        event: { id: 'normal', title: 'Fluxo Normal', desc: 'Dia ensolarado. Tráfego padrão.', icon: 'ri-sun-line' },
        theme: 'forest',
        pieces: [
            { id: 'main_car', type: 'car', x: 0, y: 3, orient: 'H', size: 2, isMain: true, color: 'linear-gradient(135deg, #ff416c, #ff4b2b)' },
            { id: 'car1', type: 'car', x: 2, y: 1, orient: 'V', size: 2, color: 'linear-gradient(135deg, #4776E6, #8E54E9)' },
            { id: 'car2', type: 'car', x: 3, y: 3, orient: 'V', size: 2, color: 'linear-gradient(135deg, #11998e, #38ef7d)' }
        ]
    },
    {
        num: 2,
        title: "Desafio do Ônibus",
        description: "O fluxo coletivo exige mais espaço e paciência.",
        target: { x: 5, y: 2 },
        zecaMessage: "Abra caminho para o carro principal deslizando o ônibus!",
        event: { id: 'rain', title: 'Dia de Chuva', desc: 'Pista escorregadia. Distância de segurança dobrada!', icon: 'ri-rainy-line' },
        theme: 'city',
        pieces: [
            { id: 'main_car', type: 'car', x: 0, y: 2, orient: 'H', size: 2, isMain: true, color: 'linear-gradient(135deg, #ff416c, #ff4b2b)' },
            { id: 'bus1', type: 'bus', x: 3, y: 0, orient: 'V', size: 3, isMain: false, color: 'linear-gradient(135deg, #f9d423, #ff4e50)' },
            { id: 'car3', type: 'car', x: 2, y: 3, orient: 'H', size: 2, color: 'linear-gradient(135deg, #11998e, #38ef7d)' },
            { id: 'car4', type: 'car', x: 3, y: 4, orient: 'H', size: 2, color: 'linear-gradient(135deg, #4776E6, #8E54E9)' }
        ]
    },
    {
        num: 3,
        title: "Operação Pista Limpa",
        description: "Reestabeleça a conexão da via movendo os entulhos.",
        target: { x: 5, y: 3 },
        zecaMessage: "Remova os entulhos da fenda para restaurar o fluxo livre ao seu Carro!",
        event: { id: 'maintenance', title: 'Pista Limpa', desc: 'Reparo na pista. Proibido parar na junção.', icon: 'ri-hammer-line' },
        isBroken: true,
        theme: 'forest',
        pieces: [
            { id: 'main_car', type: 'car', x: 0, y: 3, orient: 'H', size: 2, isMain: true, color: 'linear-gradient(135deg, #ff416c, #ff4b2b)' },
            { id: 'deb1', type: 'debris', x: 2, y: 3, orient: 'V', size: 1, color: 'linear-gradient(135deg, #444, #666)' },
            { id: 'deb2', type: 'debris', x: 3, y: 3, orient: 'V', size: 1, color: 'linear-gradient(135deg, #444, #666)' },
            { id: 'car5', type: 'car', x: 2, y: 0, orient: 'V', size: 2, color: 'linear-gradient(135deg, #FF0099, #493240)' },
            { id: 'car6', type: 'car', x: 4, y: 4, orient: 'H', size: 2, color: 'linear-gradient(135deg, #11998e, #38ef7d)' }
        ]
    },
    {
        num: 4,
        title: "O Grande Nó",
        description: "Desfaça o bloqueio cíclico de múltiplos veículos.",
        target: { x: 5, y: 3 },
        zecaMessage: "Vários carros se bloqueando em círculo. Mova o azul primeiro!",
        event: { id: 'normal', title: 'Fluxo Normal', desc: 'Dia ensolarado. Tráfego padrão.', icon: 'ri-sun-line' },
        theme: 'city',
        pieces: [
            { id: 'main_car', type: 'car', x: 0, y: 3, orient: 'H', size: 2, isMain: true, color: 'linear-gradient(135deg, #ff416c, #ff4b2b)' },
            { id: 'car1_4', type: 'car', x: 2, y: 2, orient: 'V', size: 2, color: 'linear-gradient(135deg, #4776E6, #8E54E9)' },
            { id: 'car2_4', type: 'car', x: 2, y: 1, orient: 'H', size: 2, color: 'linear-gradient(135deg, #11998e, #38ef7d)' },
            { id: 'car3_4', type: 'car', x: 4, y: 0, orient: 'V', size: 2, color: 'linear-gradient(135deg, #FF0099, #493240)' },
            { id: 'car4_4', type: 'car', x: 3, y: 2, orient: 'V', size: 3, color: 'linear-gradient(135deg, #F00000, #DC281E)' },
            { id: 'car5_4', type: 'car', x: 1, y: 4, orient: 'H', size: 2, color: 'linear-gradient(135deg, #f9d423, #ff4e50)' }
        ]
    },
    {
        num: 5,
        title: "Engarrafamento Extremo",
        description: "O tráfego de ônibus exige rearranjos complexos.",
        target: { x: 5, y: 2 },
        zecaMessage: "Dois comboios de ônibus bloqueados! Planeje seus movimentos.",
        event: { id: 'rain', title: 'Dia de Chuva', desc: 'Pista escorregadia. Distância de segurança dobrada!', icon: 'ri-rainy-line' },
        theme: 'city',
        pieces: [
            { id: 'main_car', type: 'car', x: 0, y: 2, orient: 'H', size: 2, isMain: true, color: 'linear-gradient(135deg, #ff416c, #ff4b2b)' },
            { id: 'bus1_5', type: 'bus', x: 2, y: 0, orient: 'V', size: 3, color: 'linear-gradient(135deg, #f9d423, #ff4e50)' },
            { id: 'bus2_5', type: 'bus', x: 3, y: 1, orient: 'V', size: 3, color: 'linear-gradient(135deg, #ffbb00, #ff8c00)' },
            { id: 'car1_5', type: 'car', x: 1, y: 3, orient: 'H', size: 2, color: 'linear-gradient(135deg, #11998e, #38ef7d)' },
            { id: 'car2_5', type: 'car', x: 3, y: 4, orient: 'H', size: 2, color: 'linear-gradient(135deg, #4776E6, #8E54E9)' }
        ]
    },
    {
        num: 6,
        title: "Paz na Floresta",
        description: "Aproveite a tranquilidade antes da tempestade.",
        target: { x: 5, y: 3 },
        zecaMessage: "Muitos veículos menores aqui, mas o caminho é acessível.",
        event: { id: 'normal', title: 'Fluxo Normal', desc: 'Clima agradável na floresta.', icon: 'ri-sun-line' },
        theme: 'forest',
        pieces: [
            { id: 'main_car', type: 'car', x: 0, y: 3, orient: 'H', size: 2, isMain: true, color: 'linear-gradient(135deg, #ff416c, #ff4b2b)' },
            { id: 'c6_1', type: 'car', x: 2, y: 2, orient: 'V', size: 2, color: 'linear-gradient(135deg, #4776E6, #8E54E9)' },
            { id: 'c6_2', type: 'car', x: 3, y: 3, orient: 'V', size: 2, color: 'linear-gradient(135deg, #11998e, #38ef7d)' },
            { id: 'c6_3', type: 'bus', x: 4, y: 0, orient: 'V', size: 3, color: 'linear-gradient(135deg, #f9d423, #ff4e50)' }
        ]
    },
    {
        num: 7,
        title: "Manobra Urbana",
        description: "Um ônibus atrapalha o fluxo na cidade.",
        target: { x: 5, y: 2 },
        zecaMessage: "O ônibus longo precisa sair da frente para o Red passar.",
        event: { id: 'rain', title: 'Chuva na Cidade', desc: 'Pista escorregadia. Cuidado extra!', icon: 'ri-rainy-line' },
        theme: 'city',
        pieces: [
            { id: 'main_car', type: 'car', x: 1, y: 2, orient: 'H', size: 2, isMain: true, color: 'linear-gradient(135deg, #ff416c, #ff4b2b)' },
            { id: 'c7_1', type: 'bus', x: 3, y: 1, orient: 'V', size: 3, color: 'linear-gradient(135deg, #f9d423, #ff4e50)' },
            { id: 'c7_2', type: 'car', x: 1, y: 3, orient: 'H', size: 2, color: 'linear-gradient(135deg, #4776E6, #8E54E9)' },
            { id: 'c7_3', type: 'car', x: 4, y: 4, orient: 'H', size: 2, color: 'linear-gradient(135deg, #11998e, #38ef7d)' }
        ]
    },
    {
        num: 8,
        title: "Caminho Estreito",
        description: "Veículos pesados bloqueiam a passagem na floresta.",
        target: { x: 5, y: 3 },
        zecaMessage: "Limpe uma das faixas para liberar o tráfego.",
        event: { id: 'normal', title: 'Fluxo Normal', desc: 'Dia ensolarado.', icon: 'ri-sun-line' },
        theme: 'forest',
        pieces: [
            { id: 'main_car', type: 'car', x: 0, y: 3, orient: 'H', size: 2, isMain: true, color: 'linear-gradient(135deg, #ff416c, #ff4b2b)' },
            { id: 'c8_1', type: 'bus', x: 2, y: 0, orient: 'V', size: 3, color: 'linear-gradient(135deg, #f9d423, #ff4e50)' },
            { id: 'c8_2', type: 'bus', x: 3, y: 1, orient: 'V', size: 3, color: 'linear-gradient(135deg, #ffbb00, #ff8c00)' },
            { id: 'c8_3', type: 'car', x: 4, y: 4, orient: 'V', size: 2, color: 'linear-gradient(135deg, #4776E6, #8E54E9)' }
        ]
    },
    {
        num: 9,
        title: "Cruzamento Crítico",
        description: "Trânsito de todos os lados.",
        target: { x: 5, y: 2 },
        zecaMessage: "Mova os veículos na ordem correta, destrave o cruzamento.",
        event: { id: 'maintenance', title: 'Reparo na Pista', desc: 'Atenção aos bloqueios.', icon: 'ri-hammer-line' },
        theme: 'city',
        pieces: [
            { id: 'main_car', type: 'car', x: 0, y: 2, orient: 'H', size: 2, isMain: true, color: 'linear-gradient(135deg, #ff416c, #ff4b2b)' },
            { id: 'c9_1', type: 'car', x: 2, y: 1, orient: 'V', size: 2, color: 'linear-gradient(135deg, #4776E6, #8E54E9)' },
            { id: 'c9_2', type: 'car', x: 3, y: 2, orient: 'V', size: 2, color: 'linear-gradient(135deg, #11998e, #38ef7d)' },
            { id: 'c9_3', type: 'car', x: 1, y: 3, orient: 'H', size: 2, color: 'linear-gradient(135deg, #f9d423, #ff4e50)' },
            { id: 'c9_4', type: 'car', x: 4, y: 0, orient: 'V', size: 2, color: 'linear-gradient(135deg, #FF0099, #493240)' }
        ]
    },
    {
        num: 10,
        title: "A Última Saída",
        description: "Engarrafamento total, mostre sua habilidade.",
        target: { x: 5, y: 3 },
        zecaMessage: "Um quebra-cabeça mestre para sair da floresta!",
        event: { id: 'normal', title: 'Fluxo Normal', desc: 'Céu aberto.', icon: 'ri-sun-line' },
        theme: 'forest',
        pieces: [
            { id: 'main_car', type: 'car', x: 0, y: 3, orient: 'H', size: 2, isMain: true, color: 'linear-gradient(135deg, #ff416c, #ff4b2b)' },
            { id: 'b1', type: 'bus', x: 3, y: 1, orient: 'V', size: 3, color: 'linear-gradient(135deg, #f9d423, #ff4e50)' },
            { id: 'c1', type: 'car', x: 4, y: 3, orient: 'V', size: 2, color: 'linear-gradient(135deg, #4776E6, #8E54E9)' }
        ]
    }
];

// Gerar mais 25 fases (11 a 35) progressivamente
const baseBoards = [
    [
        { id: 'main_car', type: 'car', x: 0, y: 3, orient: 'H', size: 2, isMain: true, color: 'linear-gradient(135deg, #ff416c, #ff4b2b)' },
        { id: 'b1', type: 'bus', x: 2, y: 1, orient: 'V', size: 3, color: '#f9d423' },
        { id: 'c1', type: 'car', x: 3, y: 3, orient: 'V', size: 2, color: '#4776E6' },
        { id: 'c2', type: 'car', x: 4, y: 0, orient: 'V', size: 2, color: '#11998e' }
    ],
    [
        { id: 'main_car', type: 'car', x: 1, y: 3, orient: 'H', size: 2, isMain: true, color: 'linear-gradient(135deg, #ff416c, #ff4b2b)' },
        { id: 'c1', type: 'car', x: 3, y: 2, orient: 'V', size: 2, color: '#FF0099' },
        { id: 'c2', type: 'car', x: 4, y: 4, orient: 'H', size: 2, color: '#ccc' },
        { id: 'b1', type: 'bus', x: 0, y: 0, orient: 'H', size: 3, color: '#f3f' }
    ],
    [
        { id: 'main_car', type: 'car', x: 0, y: 3, orient: 'H', size: 2, isMain: true, color: 'linear-gradient(135deg, #ff416c, #ff4b2b)' },
        { id: 'c1', type: 'car', x: 3, y: 3, orient: 'V', size: 2, color: '#2a2' },
        { id: 'c2', type: 'car', x: 4, y: 4, orient: 'H', size: 2, color: '#00e5ff' },
        { id: 'c3', type: 'car', x: 2, y: 0, orient: 'H', size: 2, color: '#ffb' }
    ],
    [
        { id: 'main_car', type: 'car', x: 0, y: 3, orient: 'H', size: 2, isMain: true, color: 'linear-gradient(135deg, #ff416c, #ff4b2b)' },
        { id: 'b1', type: 'bus', x: 3, y: 1, orient: 'V', size: 3, color: '#f9d423' },
        { id: 'b2', type: 'bus', x: 1, y: 0, orient: 'V', size: 3, color: '#4776E6' }
    ],
    [
        { id: 'main_car', type: 'car', x: 0, y: 3, orient: 'H', size: 2, isMain: true, color: 'linear-gradient(135deg, #ff416c, #ff4b2b)' },
        { id: 'c1', type: 'car', x: 2, y: 2, orient: 'V', size: 2, color: '#FF0099' },
        { id: 'c2', type: 'car', x: 1, y: 4, orient: 'H', size: 2, color: '#11998e' },
        { id: 'c3', type: 'car', x: 4, y: 4, orient: 'V', size: 2, color: '#ccc' }
    ],
    [
        { id: 'main_car', type: 'car', x: 0, y: 3, orient: 'H', size: 2, isMain: true, color: 'linear-gradient(135deg, #ff416c, #ff4b2b)' },
        { id: 'b1', type: 'bus', x: 2, y: 0, orient: 'V', size: 3, color: '#f3f' },
        { id: 'b2', type: 'bus', x: 3, y: 3, orient: 'V', size: 3, color: '#ffb' },
        { id: 'c1', type: 'car', x: 4, y: 1, orient: 'H', size: 2, color: '#00e5ff' }
    ],
    [
        { id: 'main_car', type: 'car', x: 0, y: 3, orient: 'H', size: 2, isMain: true, color: 'linear-gradient(135deg, #ff416c, #ff4b2b)' },
        { id: 'c1', type: 'car', x: 2, y: 3, orient: 'V', size: 2, color: '#777' },
        { id: 'c2', type: 'car', x: 3, y: 3, orient: 'V', size: 2, color: '#888' },
        { id: 'c3', type: 'car', x: 4, y: 3, orient: 'V', size: 2, color: '#999' },
        { id: 'c4', type: 'car', x: 2, y: 1, orient: 'H', size: 2, color: '#aaa' }
    ]
];

for(let i=11; i<=59; i++) {
    let base = JSON.parse(JSON.stringify(baseBoards[i % baseBoards.length]));
    LEVELS.push({
        num: i,
        title: `Desafio ${i}`,
        description: `Resolva o engarrafamento!`,
        target: { x: 5, y: 3 },
        zecaMessage: "Mais um nó no trânsito para desfazer.",
        event: { id: 'normal', title: 'Fluxo Intenso', desc: 'Tráfego rodando.', icon: 'ri-car-line' },
        theme: i % 2 === 0 ? 'city' : 'forest',
        pieces: base
    });
}

// Fase 60 - O mega difícil e final
LEVELS.push({
    num: 60,
    title: "O Mega Engarrafamento Final",
    description: "Mostre que você é o verdadeiro mestre para ganhar o troféu!",
    target: { x: 5, y: 3 },
    zecaMessage: "É tudo ou nada. Um congestionamento de fechar as vias. Boa sorte!",
    event: { id: 'normal', title: 'Caos Total', desc: 'O maior desafio.', icon: 'ri-alert-line' },
    theme: 'city',
    pieces: [
        { id: 'main_car', type: 'car', x: 1, y: 3, orient: 'H', size: 2, isMain: true, color: 'linear-gradient(135deg, #ff416c, #ff4b2b)' },
        { id: 'b1', type: 'bus', x: 0, y: 0, orient: 'V', size: 3, color: 'linear-gradient(135deg, #f9d423, #ff4e50)' },
        { id: 'c1', type: 'car', x: 1, y: 0, orient: 'H', size: 2, color: 'linear-gradient(135deg, #4776E6, #8E54E9)' },
        { id: 'c2', type: 'car', x: 4, y: 0, orient: 'V', size: 2, color: 'linear-gradient(135deg, #11998e, #38ef7d)' },
        { id: 'c3', type: 'car', x: 5, y: 0, orient: 'V', size: 2, color: 'linear-gradient(135deg, #FF0099, #493240)' },
        { id: 'c4', type: 'car', x: 1, y: 1, orient: 'V', size: 2, color: '#333' },
        { id: 'c5', type: 'car', x: 2, y: 1, orient: 'H', size: 2, color: '#00e5ff' },
        { id: 'b2', type: 'bus', x: 3, y: 2, orient: 'V', size: 3, color: '#f3f' },
        { id: 'c6', type: 'car', x: 0, y: 4, orient: 'H', size: 2, color: '#2a2' },
        { id: 'c7', type: 'car', x: 4, y: 4, orient: 'V', size: 2, color: '#13f' },
        { id: 'c8', type: 'car', x: 2, y: 5, orient: 'H', size: 2, color: '#ccc' }
    ]
});

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

    // Apply level theme to body
    document.body.className = `theme-${lvl.theme || 'city'}`;

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
        div.className = `piece piece-${p.type} orient-${p.orient}`;
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
    const clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    const clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
    
    gameState.dragStart = { x: clientX, y: clientY };
    gameState.initialPiecePos = { x: piece.x, y: piece.y };

    let minX = 0;
    let maxX = GRID_SIZE - (piece.orient === 'H' ? piece.size : 1);
    let minY = 0;
    let maxY = GRID_SIZE - (piece.orient === 'V' ? piece.size : 1);

    const lvl = LEVELS.find(l => l.num === gameState.level);
    if (lvl && piece.isMain && piece.orient === 'H' && piece.y === lvl.target.y) {
        maxX = GRID_SIZE; // slide off rightwards!
    }

    gameState.pieces.forEach(o => {
        if (o.id === piece.id) return;

        const p1Y = piece.y;
        const p1H = piece.orient === 'V' ? piece.size : 1;
        const p2Y = o.y;
        const p2H = o.orient === 'V' ? o.size : 1;
        const intersectY = (p1Y < p2Y + p2H && p1Y + p1H > p2Y);

        const p1X = piece.x;
        const p1W = piece.orient === 'H' ? piece.size : 1;
        const p2X = o.x;
        const p2W = o.orient === 'H' ? o.size : 1;
        const intersectX = (p1X < p2X + p2W && p1X + p1W > p2X);

        if (piece.orient === 'H' && intersectY) {
            if (o.x < piece.x) minX = Math.max(minX, o.x + p2W);
            if (o.x > piece.x) maxX = Math.min(maxX, o.x - piece.size);
        } else if (piece.orient === 'V' && intersectX) {
            if (o.y < piece.y) minY = Math.max(minY, o.y + p2H);
            if (o.y > piece.y) maxY = Math.min(maxY, o.y - piece.size);
        }
    });

    gameState.dragBounds = { minX, maxX, minY, maxY };

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

    let cellTargetX = gameState.initialPiecePos.x;
    let cellTargetY = gameState.initialPiecePos.y;

    if (p.type === 'pedestrian' || p.type === 'cyclist') {
        cellTargetX = gameState.initialPiecePos.x + moveX;
        cellTargetY = gameState.initialPiecePos.y + moveY;
    } else if (p.orient === 'H') {
        cellTargetX = gameState.initialPiecePos.x + moveX;
    } else if (p.orient === 'V') {
        cellTargetY = gameState.initialPiecePos.y + moveY;
    }

    // Border constraints for logic
    if (p.orient === 'H' || p.orient === 'V') {
        cellTargetX = Math.max(gameState.dragBounds.minX, Math.min(gameState.dragBounds.maxX, cellTargetX));
        cellTargetY = Math.max(gameState.dragBounds.minY, Math.min(gameState.dragBounds.maxY, cellTargetY));
    } else {
        const lvl = LEVELS.find(l => l.num === gameState.level);
        let maxXi = GRID_SIZE - (p.orient === 'H' ? p.size : 1);
        const isExitRow = lvl && p.isMain && p.orient === 'H' && p.y === lvl.target.y;
        if (isExitRow) maxXi = GRID_SIZE;
        cellTargetX = Math.max(0, Math.min(maxXi, cellTargetX));
        cellTargetY = Math.max(0, Math.min(GRID_SIZE - (p.orient === 'V' ? p.size : 1), cellTargetY));
    }

    // Now for visual target
    let visualTargetX = gameState.initialPiecePos.x;
    let visualTargetY = gameState.initialPiecePos.y;

    if (p.type === 'pedestrian' || p.type === 'cyclist') {
        visualTargetX += (deltaX / cellW);
        visualTargetY += (deltaY / cellH);
    } else if (p.orient === 'H') {
        visualTargetX += (deltaX / cellW);
    } else if (p.orient === 'V') {
        visualTargetY += (deltaY / cellH);
    }

    // Visual bounds
    if (p.orient === 'H' || p.orient === 'V') {
        visualTargetX = Math.max(gameState.dragBounds.minX, Math.min(gameState.dragBounds.maxX, visualTargetX));
        visualTargetY = Math.max(gameState.dragBounds.minY, Math.min(gameState.dragBounds.maxY, visualTargetY));
    } else {
        const lvl = LEVELS.find(l => l.num === gameState.level);
        let maxXi = GRID_SIZE - (p.orient === 'H' ? p.size : 1);
        const isExitRow = lvl && p.isMain && p.orient === 'H' && p.y === lvl.target.y;
        if (isExitRow) maxXi = GRID_SIZE;
        visualTargetX = Math.max(0, Math.min(maxXi, visualTargetX));
        visualTargetY = Math.max(0, Math.min(GRID_SIZE - (p.orient === 'V' ? p.size : 1), visualTargetY));
    }

    // Continuous visual update
    const el = document.getElementById(p.id);
    if (el) {
        el.style.left = `calc(${visualTargetX * CELL_SIZE_PCT}% + 4px)`;
        el.style.top = `calc(${visualTargetY * CELL_SIZE_PCT}% + 4px)`;
    }

    gameState._tempX = cellTargetX;
    gameState._tempY = cellTargetY;
    
    // Safety Zone highlights (Blue glow)
    highlightSafetyZones(p, cellTargetX, cellTargetY);
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
    // Disabled to allow authentic Rush Hour physics
    if (piece.type === 'car' || piece.type === 'bus') {
        const isSafe = checkSafetyDistance(piece, curX, curY);
        if (!isSafe) {
            // We just let it silently violate safety! No block.
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

    if (mainPiece.x + mainPiece.size - 1 >= lvl.target.x && mainPiece.y === lvl.target.y) { // reached target grid cell
        showWinModal();
    }
}

function showWinModal() {
    overlayEl.style.display = 'flex';
    
    if (gameState.level === LEVELS.length) {
        modalTitleEl.innerHTML = "🏆 Vitória Épica!";
        modalDescEl.textContent = "Você completou todos os níveis e provou ser o mestre do trânsito!";
        document.getElementById('modal-icon').innerHTML = '<i class="ri-trophy-fill" style="color: gold; text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);"></i>';
    } else {
        modalTitleEl.textContent = "Fase Concluída!";
        modalDescEl.textContent = "Você guiou o Carro com empatia.";
        document.getElementById('modal-icon').innerHTML = '<i class="ri-checkbox-circle-line"></i>';
    }
    
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
