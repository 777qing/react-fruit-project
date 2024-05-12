import { ConfigProvider } from "antd";
import { BrowserRouter as Router, Route, Routes, Navigate, Link, useRoutes } from 'react-router-dom';
import routes from './routes/index'
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';

function App() {
  const element = useRoutes(routes)
  return (
    <ConfigProvider locale={zhCN}>
      {element}
      {/* <Router></Router> */}
      {/* <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/category/*" element={<Category />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router> */}
    </ConfigProvider>
  );
}

export default App;
