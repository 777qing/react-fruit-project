import { Service } from './service'

// 用户注册
export function Register(data){
  return Service({
    url:'/users/register',
    method:'post',
    data:data
  })
}

//用户登录
export function logIn(data) {
  return Service({
    url: `/users/login`,
    method: 'post',
    data: data
  })
}
// 回去用户信息
export function getUserInfo(id) {
  return Service({
    url: `/users/${id}`,
    method: 'get'
  })
}
// 修改用户信息
export function putUserInfo(id, data) {
  return Service({
    url: `users/edit/${id}`,
    method: 'put',
    data: data
  })
}

// 获取类别水果
export function getCategory(url) {
  return Service({
    url: `/fruits/category/${url}`,
    method: 'get',

  })
}

// 获取单个水果
export function getFruit(id) {
  return Service({
    url: `/fruits/single/${id}`,
    method: 'get'
  })
}
// 获取全部水果
export function getAllFruits() {
  return Service({
    url: `/fruits/all`,
    method: 'get'
  })
}
// 搜索水果
export function searchFruits(search) {
  return Service({
    url: `fruits/search/${search}`,
    method: 'get'
  })
}
// 查询特价水果
export function getSpecial() {
  return Service({
    url: `fruits/special`,
    method: 'get'
  })
}

// 加入购物车
export function addShopping(data, id) {
  return Service({
    url: `/users/add_shop/${id}`,
    method: 'post',
    data: data
  })
}

// 获取购物车
export function getShopping(user_id) {
  return Service({
    url: `/users/get_shop/${user_id}`,
    method: 'get'
  })
}
// 删除购物车水果
export function deleteShopFruit(user_id, id) {
  return Service({
    url: `/users/delete_shop/${user_id}/${id}`,
    method: 'delete'
  })
}

// 修改水果数量
export function putFuitNumber(user_id, data) {
  return Service({
    url: `/users/shop_number/${user_id}`,
    method: 'put',
    data: data
  })
}

// 添加地址
export function postUserAddress(user_id, data) {
  return Service({
    url: `/users/add_address/${user_id}`,
    method: 'post',
    data: data
  })
}
// 修改地址
export function putUserAddress(user_id, id, data) {
  return Service({
    url: `/users/put_address/${user_id}/${id}`,
    method: 'put',
    data: data
  })
}

//删除地址
export function deleteUserAddress(user_id, id) {
  return Service({
    url: `/users/delete_address/${user_id}/${id}`,
    method: 'delete',
  })
}


// 结算订单
export function postUderOrder(data) {
  return Service({
    url: `/order_form/buy`,
    method: 'post',
    data: data
  })
}

// 查询单个用户的订单
export function getUserOrder(user_id) {
  return Service({
    url: `/order_form/user_order/${user_id}`,
    method: 'get'
  })
}