const gridSize = 40;
var rects;
var players;
var ball;
var intersections;
var arrows;

// width = 680 (gridSize * 17) (Computed)
// height = 840 (gridSize * 21) (Computed)

SVG.on(document, 'DOMContentLoaded', function() {
    var draw =  SVG().size(gridSize*16, gridSize*20).addTo('#table-container');
    rects = draw.group().addClass('rects');
    players = draw.group().addClass('players');
    ball = draw.group().addClass('ball');
    intersections = draw.group().addClass('intersections');
    arrows = draw.group().addClass('arrows');

    createGrid();
    createIntersections();
    addPlayer(2, 2);
    addPlayer(14, 2);
    addPlayer(14, 18);
    addPlayer(2, 18);
    addBall(8, 10);
});

const createGrid = () => {
    for(var i=0; i<=14; i++) {
        for(var j=0; j<=18; j++) {
            // color top row blue and bottom row red with opacity 0.5
            // add number to each square
            if(i != 0 && j != 0 && j != 1 && j != 1) rects.rect(gridSize, gridSize).fill('#fff').stroke({ width: 1, color: "#000"}).move(gridSize*i, gridSize*j);
            if(j == 1 && i != 0) rects.rect(gridSize, gridSize).fill('#00ff00').opacity("0.42").stroke({ width: 1, color: "#000", opacity: 1}).move(gridSize*i, gridSize*j);
            if(j == 18 && i != 0) rects.rect(gridSize, gridSize).fill('#ff0000').opacity("0.42").stroke({ width: 1, color: "#000", opacity: 1}).move(gridSize*i, gridSize*j);

            // draw text of size 10
            if(i == 0) rects.text("\t" + (j+1)).font({ size: gridSize/2 }).move(i*gridSize + (gridSize/4), (j+1)*gridSize - (gridSize/4));
            if(j == 0) rects.text("\t" + (i+1)).font({ size: gridSize/2 }).move((i+1)*gridSize - (gridSize/4), j*gridSize + (gridSize/4));
        }
    }
}

const onClick = (x, y) => {
    console.log("Clicked on " + x + ", " + y);
}

const createIntersections = () => {
    for(var i=1; i<=15; i++) {
        for(var j=0; j<=19; j++) {
            // add an invisible circle to each intersection
            const c = intersections.circle(gridSize)
                .opacity(0)
                .fill("#888888")
                .move(gridSize*i-gridSize/2, gridSize*j-gridSize/2)
                .on('click', onClick.bind(this, i, j));
            c.on('mouseover', (x, y) => {
                c.opacity(0.8);
            }).on('mouseout', (x, y) => {
                c.opacity(0);
            });
        }
    }
}

// add player
const addPlayer = (x, y) => {
    players.circle(gridSize).fill('#000').move(gridSize*x-gridSize/2, gridSize*y-gridSize/2);
}

// add player
const addBall = (x, y) => {
    // download svg file from /marble.svg and place it at x, y
    ball.circle(gridSize).fill('#000').move(gridSize*x-gridSize/2, gridSize*y-gridSize/2);
    ball.image('/marble.svg', gridSize-10, gridSize-10).move((gridSize*x-gridSize/2)+2.5, (gridSize*y-gridSize/2)+2.5);
}

const addLine = (x1, y1, x2, y2) => {
    // draw line from x1, y1 to x2, y2

}

const clearBoard = () => {
    players.clear();
    ball.clear();
}

function drawArrow(x1, y1, x2, y2) {
	var source = {x: gridSize*x1, y: gridSize*y1}
	var target = {x: gridSize*x2, y: gridSize*y2}

    const delta = Vector.fromPoints(source, target)

	source = delta.unitVector.scale(  8).add(source)
	target = delta.unitVector.scale(-12).add(target)

    arrows.line(source.x, source.y, target.x, target.y).stroke({ width: 2, color: 'red' }).marker('end', 10, 10, function(add) {
        add.path('M 0 0 L 10 5 L 0 10 z').fill('red')
    })
}

class Vector {
	constructor(deltaX, deltaY) { this.x = deltaX; this.y = deltaY };

	static fromPoints(source, target) {return new Vector(target.x - source.x, target.y - source.y)}

	get length() {return Math.sqrt(this.x**2 + this.y**2)}

	get unitVector() {
		if (this.length === 0) {
			return null
		} else {
			return this.scale(1/this.length)
		}
	}
	scale(scalar) {return new Vector(this.x * scalar, this.y * scalar)}
	add(other) {return new Vector(this.x + other.x, this.y + other.y)}
}

