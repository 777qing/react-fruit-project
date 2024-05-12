const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 定义每个水果对象的模式
const FruitOrderSchema = new Schema({
  id: {
    type: String,
    requiredd: true
  },
  number: {
    type: Number,
    requiredd: true
  },
  // 其他水果属性...
}, { _id: false });


const OrderFormSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  address: {
    type: Object,
    required: true
  },
  fruits_order: {
    type: [FruitOrderSchema],
    required: true
  },
  status: {
    type: Boolean,
    default: false
  },
  order_time: {
    type: Date,
    default: Date.now
  },


})
module.exports = OrderForm = mongoose.model('order_form', OrderFormSchema)