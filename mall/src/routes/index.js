import { Navigate } from 'react-router-dom'
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";
import Category from "../pages/Category/Category";
import Shopping from '../pages/Shopping/Shopping'
import Berry from "../pages/Berry/Berry";
import Citrus from '../pages/Citrus/Citrus'
import Renguo from "../pages/Renguo/Renguo";
import Drupe from '../pages/Drupe/Drupe'
import Melon from '../pages/Melon/Melon'
import Fruit from "../pages/Fruit/Fruit";
import UserMain from '../pages/UserMain/UserMain';
import Balance from '../pages/Balance/Balance'
import NotFound from '../pages/NotFound/NotFound';
import Other from '../pages/Other/Other';
import Register from '../pages/Register/Register'

// 模拟认证状态，你可以根据实际情况进行更改
// const isLogin = localStorage.getItem('user_id');
// 定义路由守卫函数
function AuthGuard({ children }) {
  // 如果已认证，则渲染子组件
  const isLogin = localStorage.getItem('user_id');
  if (isLogin) {
    return children;
  }
  // 否则重定向到登录页面
  return <Navigate to="/login" replace />;
}
export default [
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
   {
    path: '/home',
    element: <Home />
  },
  {
    path: '/category',
    element: <Category />,
    children: [{
      path: 'berry',
      element: <Berry />
    }, {
      path: 'citrus',
      element: <Citrus />
    },
    {
      path: 'renguo',
      element: <Renguo />
    },
    {
      path: 'drupe',
      element: <Drupe />
    }
      ,
    {
      path: 'melon',
      element: <Melon />
    },
    {
      path: 'fruit/:category/:fruit_id',
      element: <Fruit />
    }
    ]
  },
  {
    path: '/other',
    element: <Other />
  },
  {
    path: '/user_main',
    element: <AuthGuard><UserMain /></AuthGuard>
  },
  {
    path: '/shopping',
    element: <AuthGuard><Shopping /></AuthGuard>
  },
  {
    path: '/balance',
    element: <AuthGuard><Balance /></AuthGuard>
  },
  {
    path: '/',
    element: <Navigate to="/login" />
  },
  {
    path: '*',
    element: <NotFound />
  }
]