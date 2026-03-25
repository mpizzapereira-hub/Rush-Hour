
const GRID_SIZE = 6;

function solve(pieces, target) {
    const queue = [{ pieces, moves: 0 }];
    const visited = new Set();
    
    function getHash(p) {
        return p.map(pi => `${pi.x},${pi.y}`).join('|');
    }
    
    visited.add(getHash(pieces));
    
    let iterations = 0;
    while (queue.length > 0) {
        iterations++;
        if (iterations > 100000) return "TIMEOUT";
        
        const { pieces: currentPieces, moves } = queue.shift();
        const mainCar = currentPieces.find(p => p.isMain);
        
        // Win condition
        if (mainCar.x + mainCar.size - 1 >= target.x && mainCar.y === target.y) {
            return true;
        }
        
        for (let i = 0; i < currentPieces.length; i++) {
            const p = currentPieces[i];
            const others = currentPieces.filter((_, idx) => idx !== i);
            
            const directions = p.orient === 'H' ? [[1, 0], [-1, 0]] : [[0, 1], [0, -1]];
            
            for (const [dx, dy] of directions) {
                let nextX = p.x + dx;
                let nextY = p.y + dy;
                
                // Bounds
                if (p.orient === 'H') {
                    // isMain can exit
                    const maxAllowedX = (p.isMain && p.y === target.y) ? GRID_SIZE : GRID_SIZE - p.size;
                    if (nextX < 0 || nextX > maxAllowedX) continue;
                } else {
                    if (nextY < 0 || nextY > GRID_SIZE - p.size) continue;
                }
                
                // Collision
                const overlaps = others.some(o => {
                    const w1 = p.orient === 'H' ? p.size : 1;
                    const h1 = p.orient === 'V' ? p.size : 1;
                    const w2 = o.orient === 'H' ? o.size : 1;
                    const h2 = o.orient === 'V' ? o.size : 1;
                    return (nextX < o.x + w2 && nextX + w1 > o.x && nextY < o.y + h2 && nextY + h1 > o.y);
                });
                
                if (!overlaps) {
                    const nextPieces = currentPieces.map((pi, idx) => idx === i ? { ...pi, x: nextX, y: nextY } : pi);
                    const hash = getHash(nextPieces);
                    if (!visited.has(hash)) {
                        visited.add(hash);
                        queue.push({ pieces: nextPieces, moves: moves + 1 });
                    }
                }
            }
        }
    }
    return false;
}

const target = { x: 5, y: 3 };

// Level 21 Board from game.js new code
const level21Board = [
    { x: 0, y: 3, orient: 'H', size: 2, isMain: true },
    { x: 2, y: 0, orient: 'V', size: 3 },
    { x: 3, y: 1, orient: 'V', size: 3 },
    { x: 4, y: 3, orient: 'V', size: 2 }
];

console.log("Testing new Level 21:", solve(level21Board, target));

// Test some more levels
const level30Board = [
    { x: 0, y: 3, orient: 'H', size: 2, isMain: true },
    { x: 2, y: 0, orient: 'V', size: 3 },
    { x: 2, y: 4, orient: 'H', size: 3 },
    { x: 3, y: 1, orient: 'V', size: 3 }
];
console.log("Testing new Level 30:", solve(level30Board, target));
