// Create canvas
var c = document.createElement('canvas');
var ctx = c.getContext('2d');
var body = document.body;
var w = window.innerWidth, h = window.innerHeight;
body.setAttribute('style', 'padding:0; margin:0; background-color:black');
c.width = w;
c.height = h;
c.addEventListener('click', clickEventHandler, false);
body.appendChild(c);

// 8 ways of each chess
const way = [
    { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
    { x: -1, y: 0 }, { x: 1, y: 0 },
    { x: -1, y: 1 }, { x: 0, y: 1 }, { x: 1, y: 1 }
];

var boardSize = Math.min(w, h) * 0.75;
// Board start position
var sx = w / 2 - boardSize / 2, sy = h / 2 - boardSize / 2;
var cellSize = boardSize / 8;
// Real board size is (1 ~ 8)
var board = new Array(10);
var player = 'black';
var matchLog = [];

for (var i = 0; i < board.length; i++) {
    board[i] = new Array(10);
}

// Draw base board
ctx.fillStyle = "#009393";
ctx.fillRect(sx, sy, boardSize, boardSize);

// Draw score board
var sbSize;
if (w > h) {
    sbSize = { w: w * 0.2, h: h * 0.3 };
    ctx.fillStyle = "#555";
    ctx.fillRect(0, h / 2 - sbSize.h / 2, sbSize.w, sbSize.h);

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(sbSize.w * 0.3, h * 0.5 + sbSize.h * 0.22, sbSize.w * 0.12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(sbSize.w * 0.3, h * 0.5 - sbSize.h * 0.22, sbSize.w * 0.12, 0, Math.PI * 2);
    ctx.fill();
}
else {
    sbSize = { w: boardSize * 0.95, h: h * 0.15 };
    ctx.fillStyle = "#555";
    ctx.fillRect(w / 2 - sbSize.w / 2, 0, sbSize.w, sbSize.h);

    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(w / 2 + sbSize.w * 0.3, sbSize.h * 0.3, sbSize.h * 0.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(w / 2 - sbSize.w * 0.3, sbSize.h * 0.3, sbSize.h * 0.2, 0, Math.PI * 2);
    ctx.fill();
}




// Draw lines on base board
for (var i = 0; i < 9; i++) {
    //draw line for axis y
    ctx.beginPath();
    ctx.moveTo(sx + cellSize * i, sy);
    ctx.lineTo(sx + cellSize * i, sy + boardSize);
    ctx.stroke();
    //draw line for axis x
    ctx.beginPath();
    ctx.moveTo(sx, sy + cellSize * i);
    ctx.lineTo(sx + boardSize, sy + cellSize * i);
    ctx.stroke();
}

drawDot(sx + 2 * cellSize, sy + 2 * cellSize, '#000', 4);
drawDot(sx + 2 * cellSize, sy + 6 * cellSize, '#000', 4);
drawDot(sx + 6 * cellSize, sy + 2 * cellSize, '#000', 4);
drawDot(sx + 6 * cellSize, sy + 6 * cellSize, '#000', 4);

// Radius of chess
var r = cellSize / 2;

initialBoard();
checkPlayablePoint(player);

function clickEventHandler(event) {
    let cx = Math.floor((event.x - sx) / cellSize);
    let cy = Math.floor((event.y - sy) / cellSize);
    cx += 1;
    cy += 1;
    if (cx > 0 && cx <= 8 && cy > 0 && cy <= 8) {
        if (board[cx][cy] == 'space') {
            matchLog.push({ x: cx, y: cy, player: player });
            refreshBoard();
            drawChess(cx, cy, player, true);
            board[cx][cy] = player;
            flipChess(cx, cy, player);
            refreshScore();
            let nextPlayer = player == 'white' ? 'black' : 'white';
            if (checkPlayablePoint(nextPlayer) > 0) {
                player = nextPlayer;
            }
            else {
                if (checkPlayablePoint(player) == 0) {
                    alert('End');
                }
            }
        }
    }
}


function drawChess(x, y, type, needDot = false) {
    drawChessHelper(sx + cellSize * (x - 1) + r, sy + cellSize * (y - 1) + r, r * 0.64, type);
    if (needDot) {
        drawDot(sx + cellSize * (x - 1) + r, sy + cellSize * (y - 1) + r, '#EA0000');
        if (matchLog.length >= 2) {
            let preDot = matchLog[matchLog.length - 2];
            let preDotX = sx + cellSize * (preDot.x - 1) + r;
            let preDotY = sy + cellSize * (preDot.y - 1) + r;
            let preDotPlayer = preDot.player == 'white' ? '#fff' : '#000';
            drawDot(preDotX, preDotY, preDotPlayer, 4);
        }
    }
}

function drawChessHelper(x, y, r, type) {
    if (type == 'space') {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke()
        drawDot(x, y, '#FFFF6F')
    }
    else {
        if (type == 'white') {
            ctx.fillStyle = "#fff"
        }
        else if (type == 'black') {
            ctx.fillStyle = "#000"
        }
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill()
    }
}

function flipChess(x, y, player) {
    for (let i = 0; i < 8; i++) {
        let fc = 0;
        let tmpX = x, tmpY = y;
        while (true) {
            let cellType = board[tmpX + way[i].x][tmpY + way[i].y];
            if (cellType == 'none' || cellType == 'blank')
                break;
            else if (cellType != player && (cellType == 'white' || cellType == 'black')) {
                fc++;
                tmpX += way[i].x;
                tmpY += way[i].y;
            }
            else if (cellType == player) {
                if (fc > 0) {
                    for (let j = 1; j <= fc; j++) {
                        board[x + way[i].x * j][y + way[i].y * j] = player;
                        drawChess(x + way[i].x * j, y + way[i].y * j, player);
                    }
                }
                break;
            }
        }
    }
}

function drawDot(x, y, color, r = 3) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill()
}

function drawScore(type, x, y) {
    let size = Math.max(w, h) * 0.03;
    ctx.font = size.toString() + "px Arial";
    ctx.fillStyle = '#000';
    let sc = 0;
    for (let i = 1; i <= 8; i++) {
        for (let j = 1; j <= 8; j++) {
            if (board[i][j] == type) {
                sc++;
            }
        }
    }
    ctx.fillText(sc, x, y);
}

function refreshScore() {
    if (w > h) {
        ctx.fillStyle = "#555"
        ctx.fillRect(sbSize.w * 0.5, h / 2 - sbSize.h / 2.2, sbSize.w * 0.4, sbSize.h * 0.9);
    }
    else {
        ctx.fillStyle = "#555"
        ctx.fillRect(w / 2 - sbSize.w * 0.4, sbSize.h * 0.6, sbSize.w * 0.8, sbSize.h * 0.35);
    }

    if (w > h) {
        drawScore('black', sbSize.w * 0.7, h * 0.5 - sbSize.h * 0.15);
        drawScore('white', sbSize.w * 0.7, h * 0.5 + sbSize.h * 0.28);
    }
    else {
        drawScore('black', w / 2 - sbSize.w * 0.32, sbSize.h * 0.8);
        drawScore('white', w / 2 + sbSize.w * 0.28, sbSize.h * 0.8);
    }
}

function checkPlayablePoint(player) {
    let vc = 0;
    for (let i = 1; i <= 8; i++) {
        for (let j = 1; j <= 8; j++) {
            if (board[i][j] != player)
                continue;
            for (let idx = 0; idx < 8; idx++) {
                let tmpX = i, tmpY = j;
                let tmpC = 0;
                while (true) {
                    let cellType = board[tmpX + way[idx].x][tmpY + way[idx].y];
                    if (cellType == player || cellType == 'none' || cellType == 'space')
                        break;
                    else if (cellType != player && (cellType == 'white' || cellType == 'black')) {
                        tmpC++;
                        tmpX += way[idx].x;
                        tmpY += way[idx].y;
                    }
                    else {
                        if (tmpC > 0) {
                            board[tmpX + way[idx].x][tmpY + way[idx].y] = 'space';
                            drawChess(tmpX + way[idx].x, tmpY + way[idx].y, 'space');
                            vc++;
                        }
                        break;
                    }
                }
            }
        }
    }
    return vc;
}

function initialBoard() {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (i == 0 || i == board.length - 1 || j == 0 || j == board.length - 1)
                board[i][j] = 'none';
            else
                board[i][j] = 'blank';
        }
    }
    board[4][4] = 'white';
    drawChess(4, 4, 'white');
    board[4][5] = 'black';
    drawChess(4, 5, 'black');
    board[5][4] = 'black';
    drawChess(5, 4, 'black');
    board[5][5] = 'white';
    drawChess(5, 5, 'white');
    refreshScore();
}

function refreshBoard() {
    for (var i = 1; i < board.length - 1; i++) {
        for (var j = 1; j < board.length - 1; j++) {
            if (board[i][j] == 'space') {
                board[i][j] = 'blank';
                ctx.fillStyle = "#009393"
                ctx.fillRect(sx + cellSize * (i - 1) + 0.1 * r, sy + cellSize * (j - 1) + 0.1 * r, cellSize - 0.2 * r, cellSize - 0.2 * r);
            }
        }
    }
}
