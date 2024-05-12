const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const bcrypt = require('bcrypt')

const User = require('../modules/User')
const Fruit = require('../modules/Fruit')

// 注册
router.post('/register', (req, res) => {
    User.findOne({ phone: req.body.phone })
        .then((user) => {
            if (user) {
                console.log(user);
                return res.status(400).json({error:'手机号已经被注册'})
            } else {
                const newUser = new User({
                    name: req.body.name,
                    phone: req.body.phone,
                    password: req.body.password
                })
                // newUser.save()
                // .then(user => {
                //     res.status(200).json(user); // 返回保存后的用户信息
                // })
                // .catch(error => {
                //     res.status(500).json('保存用户失败'); // 处理保存失败的情况
                // });
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newUser.password, salt, function (err, hash) {
                        if (err) throw err
                        newUser.password = hash
                        newUser.save()
                            .then(user => {
                                res.status(200).json({data:user}); // 返回保存后的用户信息
                            })
                            .catch(error => {
                                res.status(500).json({error:error}); // 处理保存失败的情况
                            });
                    })
                })

            }
        })
})
// 登录
router.post('/login', (req, res) => {
    const password = req.body.password
    User.findOne({ phone: req.body.phone })
        .then(user => {
            console.log(user);
            if (!user) {
                return res.status(404).json({ error: '用户不存在' })
            }
            // 密码匹配
            bcrypt.compare(password, user.password)
                .then(isMath => {
                    if (isMath) {
                        return res.status(200).json( user )
                    } else {
                        return res.status(404).json({error:'密码错误'} )
                    }
                })


            // if (req.body.password != user.password) {
            //     return res.json({ status: 404, message: '密码错误' })
            // } else {
            //     return res.status(200).json({ status: 200, message: '登陆成功', data: user })
            // }

        })
        .catch(err=>{
            return res.status(500).json({ error: err })
        })
})
// 修改信息
router.put('/edit/:id', (req, res) => {
    const id = req.params.id
    const password = req.body.password
    User.findOne({ _id: id })
        .then(user => {
            bcrypt.compare(password, user.password)
                .then(isMath => {
                    if (isMath) {
                        if (req.body.modify_password) {
                            user.password = req.body.modify_password
                            bcrypt.hash(req.body.modify_password, 10, (err, hashedPassword) => {
                                if (err) {
                                    return res.status(500).json({ error: '密码加密失败' });
                                }
                                user.password = hashedPassword;
                            });
                        }
                        user.name = req.body.name
                        user.save()
                            .then(new_user => {
                                return res.status(200).json({ id: new_user.id })
                            })
                    } else {
                        return res.status(404).json({ error: '密码错误' })
                    }
                })
            // if (user.password == req.body.password) {
            //     if (req.body.modify_password) {
            //         user.password = req.body.modify_password
            //     }
            //     user.name = req.body.name
            //     user.save()
            //         .then(new_user => {
            //             return res.status(200).json({ id: new_user.id })
            //         })
            // } else {
            //     return res.status(404).json({ message: '密码错误' })
            // }
        })


})
router.get('/all', (req, res) => {
    User.find()
        .then(user => {
            console.log(user);
            return res.status(200).json(user)
        })
})
router.get('/:id', (req, res) => {
    const id = req.params.id
    User.findOne({ _id: id })
        .then(user => {
            if (user) {
                return res.status(200).json({ data: user })
            }
        })
})
router.delete('/all', (req, res) => {
    User.deleteMany({})
        .then(user => {
            console.log(user);
            return res.status(200).json('ok')
        })
})
// 获取购物车
router.get('/get_shop/:user_id', async (req, res) => {
    const id = req.params.user_id
    const user_shop_cars = []
    try {
        const user = await User.findOne({ _id: id });
        if (user) {
            console.log(user);
            for (const element of user.shopping_car) {
                const fruit = await Fruit.findOne({ _id: element.fruit_id });
                if (fruit) {
                    let car = {}
                    car.id = element._id
                    car.number = element.number
                    car.fruit_id = element.fruit_id
                    car.fruit_name = fruit.fruit_name
                    car.price = fruit.price,
                        car.specs = fruit.specs
                    car.fruit_img = fruit.fruit_img[0].replace(/\\/g, '/')
                    user_shop_cars.push(car);
                }
            }
            return res.status(200).json(user_shop_cars);
        } else {
            return res.status(404).json({ error: '用户不存在' });
        }
    } catch (error) {
        console.error('获取购物车失败：', error);
        return res.status(500).json({ error: '获取购物车失败' });
    }
})
// 添加购物车
router.post('/add_shop/:id', (req, res) => {
    const id = req.params.id;
    const { number, fruit_id } = req.body;
    const newFruitCar = {
        number,
        fruit_id
    };

    User.findOne({ _id: id })
        .then(user => {
            if (user) {
                console.log(user);
                // if (user.shopping_car) {
                const index = user.shopping_car.findIndex(item => item.fruit_id == fruit_id)
                console.log(index);
                if (index !== -1) {
                    user.shopping_car[index].number += 1
                } else {
                    // 使用 mongoose 自动生成的 _id 字段
                    newFruitCar._id = new mongoose.Types.ObjectId();

                    // 将新的水果购物车项添加到用户的购物车中
                    user.shopping_car.push(newFruitCar);
                }
                // 保存用户对象
                return user.save();
            }
        })
        .then(savedUser => {
            // 只返回用户的部分信息，避免循环结构
            const responseData = {
                _id: savedUser._id,
                shopping_car: savedUser.shopping_car
            };
            return res.status(200).json({ data: responseData });
        })
        .catch(err => {
            console.error('更新购物车失败：', err);
           return res.status(500).json({ error: '更新购物车失败' });
        });
});
// 删除购物车
router.delete('/delete_shop/:user_id/:id', (req, res) => {
    const user_id = req.params.user_id
    const id = req.params.id
    User.findOne({ _id: user_id })
        .then(user => {
            const indexRemove = user.shopping_car.findIndex(item => item._id == id)
            if (indexRemove !== -1) {
                user.shopping_car.splice(indexRemove, 1)
            } else {
                return res.status(404).json({ error: '购物车项未找到' });
            }
            user.save()
                .then(user => {
                    console.log(user);
                   return res.status(204).json(user)
                })
        })
        .catch(err=>{
            return res.status(500).json({error:'服务器错误'})
        })
})
// 操作购物车的数量
router.put('/shop_number/:user_id', (req, res) => {
    const user_id = req.params.user_id
    const newNumber = req.body.number;
    User.findOne({ _id: user_id })
        .then(user => {
            if (user) {
                let shop_id = req.body.id
                const fruitItem = user.shopping_car.find(item => item.id === shop_id)
                if (fruitItem) {
                    fruitItem.number = newNumber
                    user.save()
                        .then(updateUser => {
                            return res.status(200).json({ data: updateUser })
                        })
                        .catch(err => {

                        })
                }
                // let shop_id = req.body.id
                // user.shopping_car.forEach(element=>{
                //     if(element._id == shop_id){
                //         user.number = req.body.number
                //     }
                // })
                // user.save()
                // .then(updatedFruit => {

                // })
                // .catch(err => {

                // });
                // console.log(user.shopping_car, req.body);
                // let
            }
        })
        .catch(err=>{
            return res.status(500).json({error:err})
        })
})

// 添加收货地址
router.post('/add_address/:id', (req, res) => {
    const user_id = req.params.id
    const { address_name, address_phone, address_city, address_detailed, address_labels, address_default } = req.body
    const newAddress = {
        address_name,
        address_phone,
        address_city,
        address_detailed,
        address_labels,
        address_default
    }
    User.findOne({ _id: user_id })
        .then(user => {
            if (user) {
                // newAddress._id = new mongoose.Types.ObjectId();
                if (address_default) {
                    user.address.forEach(e => {
                        if (e.address_default) {
                            e.address_default = false
                        }
                    })
                }
                user.address.push(newAddress)
                user.save()
                    .then(saveUser => {
                        return res.status(200).json(saveUser)
                    })
            }
        })
        .catch(err=>{
            return res.status(400).json({error:err})
        })
})

// 修改收货地址
router.put('/put_address/:user_id/:id', (req, res) => {
    const user_id = req.params.user_id
    const id = req.params.id
    const { address_name, address_phone, address_city, address_detailed, address_labels, address_default } = req.body
    User.findOne({ _id: user_id })
        .then(user => {
            if (user) {
                if (address_default) {
                    let address = user.address.find(item => item.address_default == true)
                    address.address_default = false
                }
                let address = user.address.find(item => item._id == id)
                address.address_name = address_name
                address.address_phone = address_phone
                address.address_city = address_city
                address.address_detailed = address_detailed
                address.address_labels = address_labels
                address.address_default = address_default
                user.save()
                    .then(saveUser => {
                        return res.status(200).json(saveUser)
                    })
            }
        })
        .catch(err => {
            return res.status(400).json({error:'没有找到该用户'})
        })
})

// 删除收货地址
router.delete('/delete_address/:user_id/:id', (req, res) => {
    const user_id = req.params.user_id
    const id = req.params.id
    User.findOne({ _id: user_id })
        .then(user => {
            const deleteIndex = user.address.findIndex(item => item._id == id)

            if (deleteIndex !== -1) {
                user.address.splice(deleteIndex, 1)
            } else {
                return res.json({ message: '没有找到该地址' })
            }
            user.save()
                .then(newUser => {
                    return res.status(204).json(newUser._id)
                })
        })
        .catch(err => {
            return res.status(400).json('没有找到该用户')
        })
})

module.exports = router