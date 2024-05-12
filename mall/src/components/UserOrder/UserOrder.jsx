import React, { useEffect, useState } from 'react'
import { Button } from "antd";
import { getUserOrder } from '../../Service/request'
import { BaseURL } from '../../Service/api'
import './UserOrder.css'


export default function UserOrder(props) {
    const user_id = localStorage.getItem('user_id')
    const { user } = props
    const [userOrderList, setUserOrderList] = useState([])

    useEffect(() => {
        getOrder()
    }, [])

    const getOrder = () => {
        getUserOrder(user_id)
            .then(res => {
                if (res.status == 200) {
                    // console.log(res);
                    setUserOrderList(res.data)
                }
            })
    }
    return (
        <div className='user_order'>
            <ul className='user_order_list'>
                {
                    userOrderList.map(item => (
                        <li key={item._id}>
                            <div className='order_list_state'>
                                <p>{item.order_time}</p>
                                <p className='order_status'>{item.status ? '已发货' : '未发货'}</p>
                            </div>
                            <div className='order_list_info'>
                                {
                                    // item.fruits_order.length
                                    item.fruits_order.length == 1 ?
                                        <div className='left_one'>
                                            <div className='order_list_left'>
                                                <img className='order_img' src={BaseURL + '/' + item.fruits_order[0].fruit_img} alt="" />
                                                <div>
                                                    <p>{item.fruits_order[0].fruit_name}</p>
                                                </div>
                                            </div>
                                            <div className='order_list_right'>
                                                <p className='price'>￥ {item.fruits_order[0].price}</p>
                                                <p>共{item.fruits_order.length}件</p>
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <div className='left_one'>
                                                <div className='order_list_left'>
                                                    {
                                                        item.fruits_order.slice(0, 3).map(item => (
                                                            <div className='order_list_item'>
                                                                <img className='order_img' src={BaseURL + '/' + item.fruit_img} alt="" />
                                                                <p className='more_order_name'>{item.fruit_name}</p>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                                <div className='order_list_right'>
                                                    <p className='price'>￥ {item.fruits_order.reduce((acc, curr) => acc + (curr.number * curr.price.toFixed(2)), 0)}</p>
                                                    <p>共{item.fruits_order.length}件</p>
                                                </div>
                                            </div>

                                        </div>

                                }


                            </div>
                            <div className='order_list_footer'>
                                <Button>确认收货</Button>
                            </div>
                        </li>
                    ))
                }
                {/* <li>
                    <div className='order_list_state'>
                        <p>2024-04-28</p>
                        <p className='order_status'>未发货</p>
                    </div>
                    <div className='order_list_info'>
                        <div className='left_one'>
                            <div className='order_list_left'>
                                <img className='order_img' src={test_img} alt="" />
                                <div>
                                    <p>name</p>
                                </div>
                            </div>
                            <div className='order_list_right'>
                                <p>23.0</p>
                                <p>共几件</p>
                            </div>
                        </div>

                    </div>
                    <div className='order_list_footer'></div>
                </li>

                <li>
                    <div className='order_list_state'>
                        <p>2024-04-28</p>
                        <p className='order_status'>未发货</p>
                    </div>
                    <div className='order_list_info'>
                        <div className='left_one'>
                            <div className='order_list_left'>
                                <div className='order_list_item'>
                                    <img className='order_img' src={test_img} alt="" />
                                    <p className='more_order_name'>name....</p>
                                </div>
                                <div className='order_list_item'>
                                    <img className='order_img' src={test_img} alt="" />
                                    <p className='more_order_name'>name....</p>
                                </div>
                                <div className='order_list_item'>
                                    <img className='order_img' src={test_img} alt="" />
                                    <p className='more_order_name'>是一段很长很长的文字，当它超出容器时，....</p>
                                </div>
                            </div>
                            <div className='order_list_right'>
                                <p>23.0</p>
                                <p>共几件</p>
                            </div>
                        </div>

                    </div>
                    <div className='order_list_footer'></div>
                </li> */}
            </ul>
        </div>
    )
}
