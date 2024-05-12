const mongoose = require('mongoose')

const Schema = mongoose.Schema

const FruitCar = new Schema({
    fruit_id: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        default: 1
    },
})

const UserAddress = new Schema({
    address_name:{
        type:String,
        required:true
    },
    address_phone:{
        type:String,
        required:true
    },
    address_city:{
        type:Array,
        required:true
    },
    address_labels:{
        type:Array,
        required:true
    },
    address_detailed:{
        type:String,
        required:true
    },
    address_default:{
        type:Boolean,
        required:true
    }
    
})

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    shopping_car: {
        type: [FruitCar],
        default: []
    },
    address: {
        type: [UserAddress],
        default: []
    }
})

module.exports = User = mongoose.model('user', UserSchema)