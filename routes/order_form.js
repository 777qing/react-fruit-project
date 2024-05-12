const express = require('express')
const router = express.Router()

const OrderForm = require('../modules/OrderForm')
const User = require('../modules/User')
const Fruit = require('../modules/Fruit')


// 查询全部订单
router.get('/all_manage', (req, res) => {
    OrderForm.find()
        .then(orders => {
            if (orders) {
            return res.status(200).json({data:orders})
            }
            // console.log(orders);

        })
        .catch(err=>{
            return res.status(500).json({error:err})
        })
})
router.delete('/delete_order/:id', (req, res) => {
    let id = req.params.id
    OrderForm.findOneAndDelete({ _id: id })
        .then(order => {
            console.log(order);
            return res.status(204).json(order)
        })
        .catch(err => {
            console.log(err);
        })
})
// 查询单个订单
router.get('/order/:id', (req, res) => {
    const id = req.params.id
    OrderForm.findOne({ _id: id })
        .then(order => {
            if (order) {

            }
        })
})
router.delete('/all', (req, res) => {
    OrderForm.deleteMany({})
        .then(order => {
            console.log(order);
        })
})

// 修改订单状态
router.put('/edit_status/:id', (req, res) => {
    const id = req.params.id
    OrderForm.findOne({ _id: id })
        .then(order => {
            if (order) {
                console.log(order);
                order.status = true
                order.save()
                    .then(order => {
                        return res.status(200).json(order)
                    })
            }
        })
})




// 前台
// 根据用户查询订单
// router.get('/user_order/:user_id', (req, res) => {
//     let user_id = req.params.user_id
//     let new_orders = []
//     OrderForm.find({ user_id })
//         .then(orders => {
//             orders.forEach(order => {
//                 let new_order = order
//                 let fruits_order = order.fruits_order
//                 fruits_order.forEach(fruit => {
//                     Fruit.findOne({ _id: fruit.id })
//                         .then(item => {
//                             new_order.fruits_order = {
//                                 id: fruit.id,
//                                 number: fruit.number,
//                                 fruit_name: item.fruit_name,
//                                 price: item.price,
//                                 fruit_img: item.fruit_img
//                             };
//                         })
//                 })
//                 console.log(new_order.fruits_order);
//                 new_orders.push(new_order)
//             })
//             console.log(new_orders.fruits_order);
//             return res.status(200).json(new_orders)
//         })
// })

router.get('/user_order/:user_id', async (req, res) => {
    // 你可以使用 forEach，但需要注意的是，forEach 不能等待异步操作完成。
    try {
        let user_id = req.params.user_id
        let new_orders = []
        const orders = await OrderForm.find({ user_id });
        for (const order of orders) {
            // _doc 是 Mongoose 中文档对象的一个特殊属性，它包含了文档的原始数据。
            //在 Mongoose 中，当你从数据库中检索文档时，每个文档都会有一个 _doc 属性，
            //其中包含了文档的实际数据。在这种情况下，order._doc 表示订单文档的原始数据。
            //通过使用 { ...order._doc }，我们实际上是在创建一个订单的副本，以免直接修改原始订单数据。
            let new_order = { ...order._doc };
            let updatedFruitsOrder = [];
            for (const fruit of order.fruits_order) {
                console.log(fruit, 'fruit');
                const item = await Fruit.findOne({ _id: fruit.id });
                console.log(item, 'item');
                updatedFruitsOrder.push({
                    id: fruit.id,
                    number: fruit.number,
                    fruit_name: item.fruit_name,
                    price: item.price,
                    fruit_img: item.fruit_img[0].replace(/\\/g, '/')
                });
            }
            new_order.fruits_order = updatedFruitsOrder;
            new_orders.push(new_order);
        }
        console.log(new_orders);
        return res.status(200).json(new_orders);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/buy', (req, res) => {
    let { user_id, address, fruits_order } = req.body
    const newOrder = new OrderForm({
        user_id,
        address,
        fruits_order
    })
    newOrder.save()
        .then(order => {
            order.save()
                .then(order_item => {
                    deleteUserShoping(fruits_order, user_id)
                    return res.status(200).json(order_item)
                })
        })
        .catch(error => {
            // console.log(error);
            return res.status(500).json({error:error})
        })
})



function deleteUserShoping(fruits_order, user_id) {
    console.log(fruits_order);
    User.findOne({ _id: user_id })
        .then(user => {
            // user.shopping_car.forEach(element => {
            //     console.log(element);
            // })
            fruits_order.forEach(element => {
                let shopping_item = user.shopping_car.findIndex(item => item._id == element._id)
                user.shopping_car.splice(shopping_item, 1)
            })
            user.save()
                .then(user => {
                    // return res.status(200)
                })
        })

}
module.exports = router