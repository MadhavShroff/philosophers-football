const mongoose = require("mongoose");
const User = require("./user.model");

const Game = mongoose.model(
  "Game",
    new mongoose.Schema({
        player1: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
        player2: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        player1Username: { type: String, required: true },
        player2Username: { type: String, required: true },
        blackTokens: [
            {x: Number, y: Number}
        ],
        ballPosition: {
            x: Number, y: Number
        },
        winner: { type: String, required: false },
        turn: { type: String, required: true },
        gameStatus: { type: String, required: true },
        gameId: { type: Number, required: true }
    })
);

module.exports = Game;