const gridSize = 40;

SVG.on(document, 'DOMContentLoaded', function() {
    var draw = SVG().size("900", "1000").addTo('body');

    function createGrid() {
        for(var i=0; i<=15; i++) {
            for(var j=0; j<=19; j++) {
                // add number to each square
                if(i != 0 && j != 0) draw.rect(gridSize, gridSize).fill('#fff').stroke({ width: 1, color: "#000"}).move(gridSize*i, gridSize*j);
                // draw text of size 10
                if(i == 0) draw.text("\t" + (j+1)).font({ size: gridSize/2 }).move(i*gridSize + (gridSize/4), (j+1)*gridSize - (gridSize/4));
                if(j == 0) draw.text("\t" + (i+1)).font({ size: gridSize/2 }).move((i+1)*gridSize - (gridSize/4), j*gridSize + (gridSize/4));
            }
        }
    }

    // add player
    function addPlayer(x, y) {
        draw.circle(gridSize).fill('#000').move(gridSize*x-gridSize/2, gridSize*y-gridSize/2);
    }

    createGrid();
    addPlayer(2, 2);
    addPlayer(15, 2);
    addPlayer(15, 19);
    addPlayer(2, 19);
});

