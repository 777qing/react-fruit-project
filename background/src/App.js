import { ConfigProvider,message } from "antd";
import { useRoutes } from 'react-router-dom'
import routes from './routes/index'
import zhCN from 'antd/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import './App.css';


function App() {
  const element = useRoutes(routes)
  return (
    <ConfigProvider locale={zhCN}>
      {element}
    </ConfigProvider>
  );
}

export default App;
