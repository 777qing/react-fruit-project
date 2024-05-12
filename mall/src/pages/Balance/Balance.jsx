import React, { useEffect, useState } from 'react'
import { Button, message, Modal, List, Skeleton, notification } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom'

import TopInfo from '../../components/TopInfo/TopInfo'
import { getUserInfo, getAllFruits, postUderOrder } from '../../Service/request'
import { BaseURL } from '../../Service/api'
import './Balance.css'

export default function Balance() {
  const user_id = localStorage.getItem('user_id')
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage();
  const { state: { order_data } } = useLocation()
  const [orderData, setOrderData] = useState([])
  const [orderAddress, setOrderAddress] = useState({})
  const [userAddress, setUserAddress] = useState({})
  const [goodsNumber, setGoodsNumber] = useState(0)
  const [goodsPrice, setGoodsPrice] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  useEffect(() => {
    setOrderData(JSON.parse(order_data))
    let good_number = 0
    let sum_price = 0
    JSON.parse(order_data).forEach(element => {
      good_number += element.number
      sum_price = sum_price + (element.number * element.price)
    })
    setGoodsNumber(good_number)
    setGoodsPrice(sum_price)
    getUser()
  }, [])
  const getUser = () => {
    let is_default_address = false
    getUserInfo(user_id)
      .then(res => {
        // console.log(res);
        if (res.status == 200) {
          let data = res.data.data
          data.address.forEach((element) => {
            if (element.address_default) {
              setOrderAddress(element)
              is_default_address = true
            }
          });
          setUserAddress(data.address)
          if (!is_default_address) {
            setOrderAddress(data.address[0])
          }
        }
      })

  }

  const clickChangeFruitNumber = (item, type) => {
    let newNumber = item.number
    let updateOrder = [...orderData]
    if (type == 'add') {
      newNumber += 1
    } else if (type == 'sub' && newNumber !== 0) {
      newNumber -= 1
    } else {
      return
    }
    let fruitIndex = orderData.findIndex(i => i.id == item.id)
    if (fruitIndex !== -1) {

      updateOrder[fruitIndex].number = newNumber
      setOrderData(updateOrder)
    }
    setGoodsNumber(updateOrder.reduce((total, fruit) => total + fruit.number, 0))
    setGoodsPrice(updateOrder.reduce((total, fruit) => total + Number((fruit.number * fruit.price).toFixed(2)), 0))

  }

  const clickEndBalance = () => {
    if (isButtonDisabled) return;
    if (goodsPrice == 0) {
      messageApi.open({
        type: 'warning',
        content: '商品数量不能为0！',
      });
      return
    }
    let fruits_order = []
    let address = {}
    orderData.forEach(element => {
      // console.log(element);
      fruits_order.push({ id: element.fruit_id, number: element.number })
    })
    for (const k in orderAddress) {
      address.address_name = orderAddress['address_name'];
      address.address_phone = orderAddress['address_phone'];
      address.address_lanels = orderAddress['address_labels'];
    }
    let data = {
      user_id,
      address,
      fruits_order
    }
    // console.log(data);
    postUderOrder(data)
      .then(res => {
        if (res.status == 200) {
          // console.log(res);
          messageApi.open({
            type: 'success',
            content: '购买成功,即将跳转页面！',
          });
          setIsButtonDisabled(true); // 禁用按钮
          setTimeout(() => {
            setIsButtonDisabled(false);
            navigate('/shopping')
          }, 2000);
        }
      })
  }

  const clickOpenAddressModal = () => {
    setIsModalOpen(true)
    // console.log(userAddress);
  }

  const handleModalCancel = () => {
    setIsModalOpen(false)
  }

  const changeAddress = (item) => {
    // console.log(item);
    setOrderAddress(item)
    setIsModalOpen(false)
  }

  return (
    <div >
      {contextHolder}
      <TopInfo></TopInfo>
      <div className='balance_main'>
        <div className='balance_address'>
          <div>
            <p className='address_user'>{orderAddress.address_name} {orderAddress.address_phone}</p>
            <p className='address_city'>{orderAddress.address_labels} {orderAddress.address_detailed}</p>
          </div>
          <Button className='balance_button' onClick={clickOpenAddressModal}>切换地址</Button>

        </div>
        <ul className='balance_content'>
          {
            orderData.map(item => (
              <li key={item.id}>
                <div className='fruit_info'>
                  <img src={BaseURL + '/' + item.fruit_img} alt="" />
                  <div>
                    <p className='fruit_name'>{item.fruit_name}</p>
                    <p>{item.specs}</p>
                  </div>

                </div>
                <div className='number_price'>
                  <p className='price'>单价：<span>￥{item.price}</span></p>
                  <div>
                    <Button className='sub_number' onClick={() => { clickChangeFruitNumber(item, 'sub') }}>-</Button>
                    <span className='number'>{item.number}</span>
                    <Button className='add_number' onClick={() => { clickChangeFruitNumber(item, 'add') }}>+</Button>
                  </div>
                </div>

              </li>
            ))
          }

        </ul>
        <div className='balance_data'>
          <div className='sum_data'>
            共{orderData.length}款，{goodsNumber}个商品
          </div>
          <div className='sum_price'>
            <p>总计：<span className='price'>￥{goodsPrice}</span></p>
            <Button className='balance_button' onClick={clickEndBalance}>结算</Button>
          </div>
        </div>
      </div>
      <Modal title="地址切换" open={isModalOpen}
        onCancel={handleModalCancel}
        footer={[<Button key="cancel" onClick={handleModalCancel}>取消</Button>]}
      >
        <List
          itemLayout="horizontal"
          dataSource={userAddress}
          renderItem={(item, index) => (
            <List.Item
              actions={[<p onClick={() => changeAddress(item)} className='modal_address_select'>选择</p>]}
            >
              <Skeleton title={false} loading={item.loading} active>
                <List.Item.Meta
                  title={<p >{item.address_name} {item.address_phone}</p>}
                  description={item.address_labels + item.address_detailed}
                />
              </Skeleton>
            </List.Item>
          )}
        />
      </Modal>

    </div>
  )
}
