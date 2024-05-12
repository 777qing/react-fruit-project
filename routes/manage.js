const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const Manage = require('../modules/Manage')

router.post('/register', (req, res) => {
    Manage.findOne({ phone: req.body.phone })
        .then((manage) => {
            if (manage) {
                console.log(manage);
                return res.status(400).json({ error: '手机号已经被注册'})
            } else {
                const newManage = new Manage({
                    name: req.body.name,
                    identity: req.body.identity,
                    phone: req.body.phone,
                    password: req.body.password
                })
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newManage.password, salt, function (err, hash) {
                        if (err) return res.status(500).json({error:'服务器错误'})
                        newManage.password = hash
                        newManage.save()
                            .then(manage => {
                                return res.status(200).json({ data: manage }); // 返回保存后
                            })
                            .catch(error => {
                               return res.status(400).json({ error: error}); // 处理保存失败的情况
                            });
                    })
                })
                // newManage.save()
                //     .then(manage => {
                //         res.status(200).json({ data: manage, status: 200 }); // 返回保存后的用户信息
                //     })
                //     .catch(error => {
                //         res.status(500).json('保存用户失败'); // 处理保存失败的情况
                //     });
            }
        })
        .catch(err=>{
            return res.status(500).json({error:err})
        })
})

// 登录
router.post('/login', (req, res) => {
    const phone = req.body.phone
    const password = req.body.password
    Manage.findOne({ phone: phone })
        .then(manage => {
            console.log(manage,'manage');
            if (!manage) {
                return res.status(404).json({ error: '用户不存在！' })
            }
            bcrypt.compare(password, manage.password)
                .then(isMath => {

                    if (isMath) {
                        return res.status(200).json({ data:manage})
                    } else {
                        return res.status(400).json({error:'密码错误'})
                    }
                })
            // if (!manage) {
            //     return res.status(404).json({ data: '用户不存在！', status: 404 })
            // }
            // if (password != manage.password) {
            //     return res.status(400).json('密码错误')
            // } else {
            //     return res.status(200).json({ status: 200, data: manage })
            // }

        })
        .catch(err=>{
            return res.status(500).json({error:err})
        })
})
// 查询
router.get('/all', (req, res) => {
    Manage.find()
        .then(manages => {
            return res.status(200).json({ data: manages})
        })
        .catch(err => {
            return res.status(500).json({ error: err })
        })
})
// 编辑
router.post('/edit', (req, res) => {
    // const id =req.params.id
    const password = req.body.password
    Manage.findOne({ _id: req.body._id })
        .then(manage => {
            // console.log(manage, manage.password, req.body.password, req.body.modify_password);
            bcrypt.compare(password, manage.password)
                .then(isMath => {
                    if (isMath) {
                        if (req.body.modify_password) {
                            manage.password = req.body.modify_password
                            bcrypt.hash(req.body.modify_password,10,function(err,hash){
                                if(err) {
                                    return res.status(500).json({ error: '密码加密失败' });
                                }
                                manage.password = hash
                            })
                        } 
                        // else {
                            // manage.password = req.body.password
                        // }
                        manage.name = req.body.name
                        manage.phone = req.body.phone
                        manage.identity = req.body.identity
                        manage.save()
                            .then(updatedManage => {
                                return res.status(200).json({ data: updatedManage })
                            })
                            .catch(err => {
                                return res.status(400).json({error:'更新失败'});
                            });
                    } else {
                        return res.status(402).json({  error: '密码错误！' })
                    }
                })
            // if (manage.password == req.body.password) {
            //     if (req.body.modify_password) {
            //         manage.password = req.body.modify_password
            //     } else {
            //         manage.password = req.body.password
            //     }
            //     manage.name = req.body.name
            //     manage.phone = req.body.phone
            //     manage.identity = req.body.identity
            //     console.log(manage);
            //     manage.save()
            //         .then(updatedFruit => {
            //             return res.status(200).json({ status: 200, data: updatedFruit })
            //         })
            //         .catch(err => {
            //             return res.status(500).json('更新水果信息时出错');
            //         });

            // } else {
            //     return res.status(402).json({ status: 402, errors: '密码错误！' })
            // }
        })
        .catch(err => {
            return res.status(500).json({error:err})
        })
})
router.delete('/delete/:id', (req, res) => {
    const id = req.params.id
    Manage.findOneAndDelete({ _id: id })
        .then((manage) => {
            return res.status(200).json({ data: manage })
        })
        .catch((errors) => {
            return res.status(400).json({ error: errors })
        })
})
module.exports = router