const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ManageSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    modify_password: {
        type: String
    },
    identity: {
        type: String,
        required: true
    },
})

module.exports = Manage = mongoose.model('manage', ManageSchema)