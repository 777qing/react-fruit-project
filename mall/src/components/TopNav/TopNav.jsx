import React, { useState, useRef } from 'react'
import { Input, message, Button } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom'
import { searchFruits } from '../../Service/request'
import logo from '../../assect/logo.png'
import shopping_icon from '../../assect/shopping_car_icon.svg'
import './TopNav.css'

export default function TopNav() {
    const user_id = localStorage.getItem('user_id')
    const [messageApi, contextHolder] = message.useMessage();
    const searchRef = useRef()
    const navigate = useNavigate()
    const clickSearch = () => {
        // // console.log(searchRef.current.input.value);
        let value = searchRef.current.input.value
        let data = []
        searchFruits(value)
            .then(res => {
                if (res.status == 200) {
                    // // console.log(res.data);
                    data = JSON.stringify(res.data)
                    navigate('/other',
                        {
                            state: {
                                fruit_data: data
                            }
                        })
                }
            })
            .catch(err=>{
                messageApi.open({
                    type: 'warning',
                    content: err.response.data.error,
                });
            })
    }
    const clickShopping = () => {
        if (user_id) {
            navigate('/shopping')
        } else {
            messageApi.open({
                type: 'warning',
                content: '请先登录！',
            });
        }
    }
    return (
        <div className='top_nav centre'>
            {contextHolder}
            <div className='logo'>
                <img className='logo_img' src={logo} alt="" />
                <div className='title'>
                    <h1>果果~商品店</h1>
                    <div>
                        简单 <span>|</span>
                        方便 <span>|</span>
                        快捷
                    </div>

                </div>

            </div>
            <ul className='classify'>

                <li> <Link className="li" to='/home'>首页</Link></li>
                <li><Link className="li" to='/category/berry'>浆果类</Link></li>
                <li><Link className="li" to='/category/citrus'>柑橘类</Link></li>
                <li><Link className="li" to='/category/renguo'>仁果类</Link></li>
                <li><Link className="li" to='/category/drupe'>核果类</Link></li>
                <li><Link className="li" to='/category/melon'>瓜类</Link></li>

            </ul>
            <div className='search'>
                <SearchOutlined />
                <Input ref={searchRef} className='search_input' placeholder="搜一搜"></Input>
                <Button onClick={clickSearch}>搜索</Button>
            </div>
            <div className='car'>
                <div onClick={clickShopping}>
                    <img src={shopping_icon} alt="" />
                    {/* <span className='car_num'>20</span> */}
                </div>

            </div>
        </div>
    )
}
