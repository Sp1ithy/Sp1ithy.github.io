    let canvas;
    let context;
    const radius = 5;
    const step = 12;
    let cols;
    let rows;
    let grid;
    let cells;
    const probability = 20;
    let autoPlay;

    function start() {
        canvas = document.getElementById('smile');
        context = canvas.getContext('2d');
        cols = parseInt(canvas.width / step);
        rows = parseInt(canvas.height / step);

        cells = 0;
        grid = new Array(rows);
        for (let i = 0; i < rows; i++) {
            grid[i] = new Array(cols);
        }
        spawn(grid);

    }


    function drawCell(x, y, color) {
        context.beginPath();
        context.fillStyle = "white";
        if (color != "" || color != undefined) context.fillStyle = color;
        context.arc(x * step, y * step, radius, 0, Math.PI * 2, false);
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
        let delay = $('#delay').val();

        if (delay < 0) delay = 1000;
        autoPlay = setInterval(function() {
            nextGeneration();
        }, delay);

    }

    function stop() {
        if(autoPlay){
            clearInterval(autoPlay);
        }
    }
