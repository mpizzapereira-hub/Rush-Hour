
const GRID_SIZE = 6;

function solve(pieces, target) {
    const queue = [{ pieces, moves: 0 }];
    const visited = new Set();
    
    function getHash(p) {
        return p.map(pi => `${pi.x},${pi.y}`).join('|');
    }
    
    visited.add(getHash(pieces));
    
    while (queue.length > 0) {
        const { pieces: currentPieces, moves } = queue.shift();
        const mainCar = currentPieces.find(p => p.isMain);
        
        // Win condition
        if (mainCar.x + mainCar.size - 1 >= target.x && mainCar.y === target.y) {
            return true;
        }
        
        if (moves > 100) continue; // Limit search
        
        for (let i = 0; i < currentPieces.length; i++) {
            const p = currentPieces[i];
            const others = currentPieces.filter((_, idx) => idx !== i);
            
            const directions = p.orient === 'H' ? [[1, 0], [-1, 0]] : [[0, 1], [0, -1]];
            
            for (const [dx, dy] of directions) {
                let nextX = p.x + dx;
                let nextY = p.y + dy;
                
                // Bounds
                if (p.orient === 'H') {
                    if (nextX < 0 || nextX + p.size > (p.isMain && p.y === target.y ? GRID_SIZE + 1 : GRID_SIZE)) continue;
                } else {
                    if (nextY < 0 || nextY + p.size > GRID_SIZE) continue;
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

// Test Level 21 as defined in game.js (expected to be baseBoards[6])
const testPieces = [
    { id: 'main_car', x: 0, y: 3, orient: 'H', size: 2, isMain: true },
    { id: 'v1', x: 2, y: 3, orient: 'V', size: 2 },
    { id: 'v2', x: 3, y: 3, orient: 'V', size: 2 },
    { id: 'v3', x: 4, y: 3, orient: 'V', size: 2 }
];
const target = { x: 5, y: 3 };

console.log("Testing baseBoards[6]:", solve(testPieces, target));

// Test the "unsolvable" one from screenshot
const unsolvablePieces = [
    { id: 'main_car', x: 0, y: 3, orient: 'H', size: 2, isMain: true },
    { id: 'blue', x: 2, y: 3, orient: 'H', size: 2 },
    { id: 'pink', x: 2, y: 0, orient: 'V', size: 3 },
    { id: 'green', x: 3, y: 0, orient: 'V', size: 3 }
];
console.log("Testing unsolvable screenshot version:", solve(unsolvablePieces, target));
