const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FruitSchema = new Schema({
    fruit_img: {
        type: Array,
        require: true
    },
    fruit_name: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    special: {
        type: Boolean,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    old_price: {
        type: Number
    },
    specs: {
        type: String,
        require: true
    },
    buy_num: {
        type: Number,
        default: 0
    },
    time: {
        type: Date,
        default: Date.now
    }
})

module.exports = Fruit = mongoose.model('fruit', FruitSchema)