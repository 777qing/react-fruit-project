const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path');
const fs = require('fs');


const Fruit = require('../modules/Fruit')

// 设置 multer 用于处理图片上传
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cd) {
        cd(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })


router.post('/add', upload.single('fruit_img'), function (req, res) {
    Fruit.findOne({ fruit_name: req.body.fruit_name })
        .then((fruit) => {
            if (fruit) {
                // 如果水果已经存在，删除已上传的文件
                if (req.file) {
                    fs.unlink(req.file.path, (err) => {
                        if (err) {
                            console.error('删除已上传文件时出错:', err);
                            return res.status(500).json({ error: '服务端问题' });
                        }
                        console.log('已上传文件已删除');
                    });
                }
                return res.status(400).json({ data: '该水果已经存在' });
            } else {
                const newFruit = new Fruit({
                    fruit_img: req.file.path,
                    fruit_name: req.body.fruit_name,
                    category: req.body.category,
                    special: req.body.special,
                    price: req.body.price,
                    old_price: req.body.old_price,
                    specs: req.body.specs,
                    buy_num: req.body.buy_num
                });
                newFruit.save()
                    .then(savedFruit => {
                        console.log('新水果已保存到数据库:', savedFruit);
                        return res.status(200).json({  data: savedFruit });
                    })
                    .catch(err => {
                        console.error('保存新水果到数据库时出错:', err);
                        return res.status(500).json({error:'保存新水果时出错'});
                    });
            }
        })
        .catch(err => {
            console.error('查询水果时出错:', err);
            return res.status(500).json({error:'查询水果时出错'});
        });
});


// 修改图片的编辑暂时没有实现
// router.post('/edit', upload.single('fruit_img'), function (req, res) {
//     Fruit.findOne({ fruit_name: req.body.fruit_name })
//         .then((fruit) => {
//             console.log(fruit,req.body,req.body.fruit_img.replace(/\//g, '\\'));
//             if (fruit) {
//                 if (fruit.fruit_img && fruit.fruit_img === req.body.fruit_img.replace(/\//g, '\\')) {
//                     fs.unlink(fruit.fruit_img[0], (err) => {
//                         if (err) {
//                             console.error('删除已上传文件时出错:', err);
//                         }
//                         console.log('已上传文件已删除');
//                     });


//                 }else{
//                     fruit.fruit_img = req.file.path;
//                 }

//                 fruit.category = req.body.category;
//                 fruit.special = req.body.special;
//                 fruit.price = req.body.price;
//                 fruit.old_price = req.body.old_price;
//                 fruit.specs = req.body.specs;
//                 fruit.save()
//                     .then(updatedFruit => {
//                         console.log('水果信息已更新:', updatedFruit);
//                         return res.status(200).json('水果信息已成功更新');
//                     })
//                     .catch(err => {
//                         console.error('更新水果信息时出错:', err);
//                         return res.status(500).json('更新水果信息时出错');
//                     });
//             } else {
//                 if (req.file) {
//                     fs.unlink(req.file.path, (err) => {
//                         if (err) {
//                             console.error('删除已上传文件时出错:', err);
//                         }
//                         console.log('已上传文件已删除');
//                     });
//                 }
//                 console.error('查询水果时出错:', err);
//                 return res.status(500).json('查询水果时出错');
//                 return res.status(400).json('该水果不存在');
//             }
//         })
//         .catch(err => {
//             if (req.file) {
//                 fs.unlink(req.file.path, (err) => {
//                     if (err) {
//                         console.error('删除已上传文件时出错:', err);
//                     }
//                     console.log('已上传文件已删除');
//                 });
//             }
//             console.error('查询水果时出错:', err);
//             return res.status(500).json('查询水果时出错');
//         });
// });

// 按照类别查水果

router.post('/edit', upload.single('fruit_img'), function (req, res) {
    Fruit.findOne({ _id: req.body._id })
        .then((fruit) => {
            if (fruit) {
                fruit.fruit_name = req.body.fruit_name
                fruit.category = req.body.category;
                fruit.special = req.body.special;
                fruit.price = req.body.price;
                fruit.old_price = req.body.old_price;
                fruit.specs = req.body.specs;
                fruit.save()
                    .then(updatedFruit => {
                        console.log('水果信息已更新:', updatedFruit);
                        return res.status(200).json({  data: updatedFruit });
                    })
                    .catch(err => {
                        console.error('更新水果信息时出错:', err);
                        return res.status(500).json({error:'更新水果信息时出错'});
                    });
            } else {
                return res.status(400).json({error: '该水果不存在' });
            }
        })
        .catch(err => {
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.error('删除已上传文件时出错:', err);
                        return res.status(500).json({error:'服务端错误'});
                    }
                });
            }
            console.error('查询水果时出错:', err);
            return res.status(500).json({error:'查询水果时出错'});
        });
});

router.get('/category/:categoryName', function (req, res) {
    const category = req.params.categoryName;
    console.log(category);
    Fruit.find({ category: category })
        .then((fruits) => {
            console.log(fruits);
            if (fruits) {
                fruits.forEach((fruit) => {
                    fruit.fruit_img = fruit.fruit_img[0].replace(/\\/g, '/')
                })
                return res.status(200).json(fruits);
            } else {
              return   res.status(404).json({error:'未找到该类别的水果'});
            }
        })
        .catch((err) => {
            console.log(err);
            return   res.status(500).json({error:err});
        })
})

// 查询全部水果
router.get('/all', function (req, res) {
    Fruit.find()
        .then((fruits) => {
            fruits.forEach((fruit) => {
                fruit.fruit_img = fruit.fruit_img[0].replace(/\\/g, '/')
            })
            return res.status(200).json({ data: fruits })
        })
        .catch((err) => {
            return res.status(500).json({ error: err })
        })
})
// 查找单个水果
router.get('/single/:id', function (req, res) {
    const id = req.params.id
    Fruit.findOne({ _id: id })
        .then(fruit => {
            if (fruit) {
                console.log(fruit);
                fruit.fruit_img = fruit.fruit_img[0].replace(/\\/g, '/')
                return res.status(200).json({ status: 200, data: fruit })
            } else {
                return res.status(400).json({ status: 400, data: '没找到该水果' })
            }
        })
        .catch(err => {

        })
})
// 查询特价水果
router.get('/special', function (req, res) {
    Fruit.find({ special: true })
        .then((fruits) => {
            if (fruits) {
                return res.status(200).json(fruits)
            }
        })
        .catch((err) => {
            console.log(err);
        })
})

// 根据名字搜索水果
router.get('/search/:fruit_name', (req, res) => {
    const fruit_name = req.params.fruit_name;
    const regex = new RegExp(fruit_name, 'i'); // 'i'表示不区分大小写

    Fruit.find({ fruit_name: { $regex: regex } })
        .then(fruits => {
            fruits.forEach((fruit) => {
                fruit.fruit_img = fruit.fruit_img[0].replace(/\\/g, '/')
            })
            return res.status(200).json(fruits);
        })
        .catch(err => {
            console.error(err);
          return  res.status(500).json({ error: 'Internal Server Error' });
        });
});


// 删除全部
router.delete('/delete', function (req, res) {
    Fruit.deleteMany({})
        .then(() => {
            console.log('所有水果数据已成功删除');
            // 删除uploads文件夹中的所有文件
            const directory = 'uploads';
            fs.readdir(directory, (err, files) => {
                if (err) {
                    console.error('读取uploads文件夹时出错:', err);
                    return res.status(500).json('删除水果数据时出错');
                }
                // 遍历文件并删除每个文件
                for (const file of files) {
                    fs.unlink(path.join(directory, file), err => {
                        if (err) {
                            console.error(`删除文件 ${file} 时出错:`, err);
                        } else {
                            console.log(`文件 ${file} 已成功删除`);
                        }
                    });
                }
            })
            res.status(200).json('所有水果数据已成功删除');
        })
        .catch((err) => {
            console.error('删除水果数据时出错:', err);
            res.status(500).json('删除水果数据时出错');
        });
});

//删除单个
router.delete('/delete/:id', function (req, res) {
    const fruitId = req.params.id;
    Fruit.findById(fruitId)
        .then(fruit => {
            if (!fruit) {
                return res.status(404).json({error:'未找到要删除的水果数据'});
            }
            // console.log(fruit.fruit_img);
            // console.log(path.join(__dirname, '..', fruit.fruit_img[0]));
            if (fruit.fruit_img) {
                // 删除图片文件
                // 删除图片文件
                // console.log(path.join(__dirname, '..', fruit.fruit_img[0]));
                fs.unlink(path.join(__dirname, '..', fruit.fruit_img[0]), err => {
                    if (err && err.errno == -4058) {
                        Fruit.findByIdAndDelete(fruitId)
                            .then(() => {
                                return res.status(200).json({ data: fruitId });
                            })
                            .catch((err) => {
                                console.error('删除水果数据时出错:', err);
                                return res.status(500).json({ error: '删除失败' });
                            });

                    } else if (err) {
                        console.error(`删除图片文件 ${fruit.fruit_img} 时出错:`, err);
                    //    return res.status(500).json(`删除图片文件 ${fruit.fruit_img} 时出错: ${err.message}`);
                    return res.status(500).json({error:'删除图片失败'});
                    }
                    else {
                        console.log(`图片文件 ${fruit.fruit_img} 已成功删除`);

                        // 删除数据库中对应ID的水果数据
                        Fruit.findByIdAndDelete(fruitId)
                            .then(() => {
                                return res.status(200).json({ data: fruitId });
                            })
                            .catch((err) => {
                                console.error('删除水果数据时出错:', err);
                                return res.status(500).json({error: '删除水果数据时出错' });
                            });
                    }
                });
            }
            else {
                // 如果水果数据没有关联图片，则直接删除数据库中的数据
                Fruit.findByIdAndDelete(fruitId)
                    .then(() => {

                        return res.status(200).json({  data: fruitId });
                    })
                    .catch((err) => {
                        console.error('删除水果数据时出错:', err);
                        return res.status(500).json({error:'删除水果数据时出错'});
                    });
            }
        })
        .catch((err) => {
            console.error('查找水果数据时出错:', err);
            return res.status(500).json({error:'查找水果数据时出错'});
        });
});

// 根据id搜索多个水果（订单水果）
router.get('/many_fruits', (req, res) => {
    // console.log());
    const ids = JSON.parse(req.query.ids); // 假设ids是一个id数组，例如：['id1', 'id2', 'id3']
    console.log(ids);
    Fruit.find({ _id: { $in: ids } }) // 使用$in操作符来查找匹配id数组中任何一个id的订单
        .then(fruits => {
            fruits.forEach((fruit) => {
                fruit.fruit_img = fruit.fruit_img[0].replace(/\\/g, '/')
            })
            return res.status(200).json(fruits)
        })
        .catch(error => {
            res.status(500).json({ error: 'Internal server error' }); // 如果发生错误，返回500状态码和错误消息
        });
});



module.exports = router