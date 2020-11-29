let canvas;
let context;
let radius = 10;
let cols;
let rows;
let grid;
let cells;
let autoPlay;

function start() {
    canvas = document.getElementById('smile');
    context = canvas.getContext('2d');

    radius = document.getElementById('radius').value;
    if(radius<2) radius = 10;

    cols = parseInt(canvas.width / radius);
    rows = parseInt(canvas.height / radius);
    cells = 0;
    grid = new Array(rows);
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
        grid[i].forEach(el=>el = false);
    }
    document.getElementById('size').innerHTML = "Size : "+ rows + " x "+cols;
    canvas.addEventListener('mousedown', putCell);
    restart();
}

function drawCell(x, y, color) {
    context.beginPath();
    context.fillStyle = "white";
    if (color != "" || color != undefined) context.fillStyle = color;
    context.rect(x * radius, y * radius, radius, radius);
    context.stroke();
    context.fill();
    context.closePath();
}

function checkNeighbors(i, j, subArray) {
    let counter = 0;
    for (let n = i - 1; n <= i + 1; n++) {
        for (let m = j - 1; m <= j + 1; m++) {
            if (n == i && m == j) continue;

            if (grid[n] != undefined && grid[n][m] != undefined) {
                if (grid[n][m] == true) {
                    counter++;
                }
            }
        }
    }

    //if cell is empty and has 3 neighbors -> create cell
    if (grid[i][j] == false && counter == 3) {
        subArray[i][j] = true;
        drawCell(i, j, "blue");
    }
    //in that case cell die
    else if (grid[i][j] && (counter < 2 || counter > 3)) {
        subArray[i][j] = false;
        drawCell(i, j, "black");
    }
    //otherwise it continue to live
    else {
        subArray[i][j] = grid[i][j];
        if (subArray[i][j]) drawCell(i, j, "green");
    }
}

function spawn() {
    let probability = document.getElementById('probability').value;
    if (probability == undefined || probability < 1) probability = 20;

    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 1; i < rows; i++) {
        for (let j = 1; j < cols; j++) {
            if (Math.random() * 100 < probability) {
                grid[i][j] = true;
                drawCell(i, j);
            } else {
                grid[i][j] = false;
            }
        }
    }
}


function nextGeneration() {
    let subArray = new Array(rows);
    for (let i = 0; i < rows; i++) {
        subArray[i] = new Array(cols);
    }

    for (let i = 1; i < rows; i++) {
        for (let j = 1; j < cols; j++) {
            checkNeighbors(i, j, subArray);
        }
    }
    grid = subArray;
}


function auto() {
    let delay = document.getElementById('delay').value;

    if (delay < 0) delay = 1000;
    autoPlay = setInterval(function () {
        nextGeneration();
    }, delay);

}

function stop() {
    if (autoPlay) {
        clearInterval(autoPlay);
    }
}


//Get Mouse Position
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function restart() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = false;
        }
    }
}


var putCell = function (e) {
    var bounds = e.target.getBoundingClientRect();
    var x = e.clientX - bounds.left;
    var y = e.clientY - bounds.top;
    x = parseCoordinate(x);
    y = parseCoordinate(y);
    grid[x][y] = true;
    drawCell(x, y, 'red');
}

function parseCoordinate(x) {
    if (x < 100) return parseInt(x / radius);
    return parseInt(x / radius);
}



