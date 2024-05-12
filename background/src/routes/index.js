import { Navigate } from 'react-router-dom'
import Login from '../Pages/Login/Login'
import Home from '../Pages/Home/Home'
import User from '../Pages/User/User'
import MallManage from '../Pages/MallManage/MallManage'
import OrderManage from '../Pages/Order/Order'

export default [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/home',
    element: <Home />,
    children: [
      {
        path: 'user',
        element: <User />
      },
      {
        path: 'mall_manage',
        element: <MallManage />
      },
      {
        path: 'order_manage',
        element: <OrderManage />
      }
    ]
  },
  {
    path: '/',
    element: <Navigate to="/login"></Navigate>
  }
]