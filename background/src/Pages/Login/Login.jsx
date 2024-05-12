import React from 'react'
import { Button, Form, Input,message } from 'antd';
import { useNavigate } from 'react-router-dom';
import request from '../../Service/request';
import './login.css'


export default function Login() {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish = (values) => {
    console.log('Success:', values);
    request.post('/manages/login',values)
    .then(res=>{
      console.log(res);
      if(res.status == 200){
        localStorage.setItem('identity',res.data.identity)
        localStorage.setItem('manage',res.data.phone)
        localStorage.setItem('manage_id',res.data._id)
        messageApi.open({
          type: 'success',
          content: '登陆成功！',
        });
        navigate({ pathname: '/home/user' }, { replace: false });
      
      }else{
        messageApi.open({
          type: 'warning',
          content: res.error,
        });
      }
    })
    .catch(err=>{
      
    })
  
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  
  };
  return (
    <div className='login'>
       {contextHolder}
      <div className="form_container">

        <div className='login_form'>
          <div className="form_tip">
            <span className="title">果果水果店后台管理系统</span>
          </div>
          <Form
            name="basic"
            labelCol={{
              span: 6,
            }}
            wrapperCol={{
              span: 16,
            }}
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="账户"
              name="phone"
              rules={[
                {
                  required: true,
                  message: '请输入您的账号!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码!',
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>

    </div>
  )
}
