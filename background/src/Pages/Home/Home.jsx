import React from 'react'
import { Menu, Button } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { Outlet, useNavigate } from 'react-router-dom'
import './Home.css'
function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const items = [
  getItem('用户管理', 'user', <MailOutlined />),
  getItem('商城', 'mall_manage', <MailOutlined />),
  getItem('订单管理', 'order_manage', <MailOutlined />),
];



export default function Home() {
  const navigate = useNavigate()
  const changeMenu = (e) => {
    console.log('click ', e);
    navigate(e.key, { replaca: true })
  };
  const logOut = () => {
    console.log('out');
    localStorage.clear();
    navigate('/login', { replaca: true })
  }
  return (
    <div className='home'>
      <div className="home_top">
        <p className='top_title'>果果水果店后台管理系统</p>
        <div className="top_user_info">
          <Button type="primary" className='out_button' onClick={logOut}>退出</Button>
        </div>
      </div>
      <div className="home_container">
        <div className="home_nav">
          <Menu
            onClick={changeMenu}
            style={{
              width: 256,
            }}
            defaultSelectedKeys={['user']}
            defaultOpenKeys={['sub1']}
            mode="inline"
            items={items}
          />
        </div>
        <div className="home_main">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
