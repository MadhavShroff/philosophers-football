
const { BoardState } = require('./BoardState.js')
const { Direction } = require('./Direction.js')
const { Jump } = require('./Jump.js')
const { Location } = require('./Location.js');
const { Tree } = require('./Tree.js');

const locStates = {
	empty  : ' ',
	player : '.',
	ball   : 'O',
};
const config = {
    cols    : 15,
    rows    : 19, // hes using letters as rows
  };

const empty  = locStates.empty;
const player = locStates.player;
const ball   = locStates.ball;

// Set the initial state
var   initialState    = Array(config.rows * config.cols).fill(empty);
const initialBallLoc = new Location((initialState.length - 1) / 2);

initialState[initialBallLoc.flatIndex] = ball;

const directions = [1,2,3,4,6,7,8,9].map(num => new Direction(num));

module.exports.getLegalJumps = (ballPosition, blackTokens) => {
    const directions = [1,2,3,4,6,7,8,9].map(num => new Direction(num))
    const state = Array(config.rows * config.cols).fill(empty);
    const ball = new Location(null, ballPosition.x, ballPosition.y);
    blackTokens.forEach(token => state[new Location(null, token.x, token.y).flatIndex] = player);
    state[ball.flatIndex] = ball;
    const jumpList  = directions.map(
        direction => Jump._fromRest(new BoardState(state, ball), direction)).reduce((left, right) => left.concat(right));
    return jumpList.map(jump => {
        return {
            willBeRemoved: jump.removedLocations.map(loc => {
                return {
                    x: loc.letterIndex,
                    y: loc.numberIndex
                }
            }),
            ballFinalPosition: {
                x: jump.endState.ballLoc.letterIndex,
                y: jump.endState.ballLoc.numberIndex
            }
        }
    });;
};