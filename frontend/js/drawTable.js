const gridSize = 40;
var rects;
var players;
var ball;

// width = 680 (gridSize * 17) (Computed)
// height = 840 (gridSize * 21) (Computed)

SVG.on(document, 'DOMContentLoaded', function() {
    var draw =  SVG().size(gridSize*17, gridSize*21).addTo('#table-container');
    rects = draw.group().addClass('rects');
    players = draw.group().addClass('players');
    ball = draw.group().addClass('ball');

    createGrid();
    addPlayer(2, 2);
    addPlayer(15, 2);
    addPlayer(15, 19);
    addPlayer(2, 19);
    addBall(9, 4);
});

const createGrid = () => {
    for(var i=0; i<=15; i++) {
        for(var j=0; j<=19; j++) {
            // add number to each square
            if(i != 0 && j != 0) rects.rect(gridSize, gridSize).fill('#fff').stroke({ width: 1, color: "#000"}).move(gridSize*i, gridSize*j);
            // draw text of size 10
            if(i == 0) rects.text("\t" + (j+1)).font({ size: gridSize/2 }).move(i*gridSize + (gridSize/4), (j+1)*gridSize - (gridSize/4));
            if(j == 0) rects.text("\t" + (i+1)).font({ size: gridSize/2 }).move((i+1)*gridSize - (gridSize/4), j*gridSize + (gridSize/4));
        }
    }
}

// add player
const addPlayer = (x, y) => {
    players.circle(gridSize).fill('#000').move(gridSize*x-gridSize/2, gridSize*y-gridSize/2);
}

const clearBoard = () => {
    players.clear();
    ball.clear();
}

// add ball
const addBall = (x, y) => {
    // TODO: add ball
}


