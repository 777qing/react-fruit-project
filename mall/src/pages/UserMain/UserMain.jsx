import React, { useEffect, useState } from 'react'
import { Tabs } from 'antd';
import { UserOutlined, HomeOutlined, SolutionOutlined } from '@ant-design/icons';
import TopInfo from '../../components/TopInfo/TopInfo'
import TopNav from '../../components/TopNav/TopNav'
import UserOrder from '../../components/UserOrder/UserOrder';
import UserInfo from '../../components/UserInfo/UserInfo';
import Address from '../../components/Address/Address';
import Balance from '../Balance/Balance';
import { getUserInfo } from '../../Service/request'
import './UserMain.css'

export default function UserMain() {
  const [user, SetUser] = useState({})
  useEffect(() => {
    getUser()
  }, [])

  const getUser = () => {
    getUserInfo(localStorage.getItem('user_id'))
      .then(res => {
        if (res.status == 200) {
          SetUser(res.data.data)
        }
      })
  }
  const onChange = (key) => {
    // console.log(key);
  };
  const items = [
    {
      key: '1',
      label: '用户信息',
      icon: <UserOutlined />,
      children: <UserInfo user={user} getUser={getUser}/>,
    },
    {
      key: '2',
      label: '地址管理',
      icon: <HomeOutlined />,
      children: <Address user={user} getUser={getUser}/>,
    },
    {
      key: '3',
      label: '订单详情',
      icon: <SolutionOutlined />,
      children: <UserOrder user={user} getUser={getUser}/>,
    },
  ];
  return (
    <div>
      <TopInfo />
      <TopNav />
      <div className='usermain centre'>
          <div className="user_info">
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
          </div>
      </div>
    </div>

  )
}
