const mongoose = require('mongoose');

const Counter = mongoose.model(
    'counter', 
    mongoose.Schema({
    _id: {type: String, required: true},
    seq: { type: Number, default: 0 }
}));

module.exports = Counter;