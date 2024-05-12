import React, { useRef, useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { logIn, Register } from '../../Service/request'
import logo from '../../assect/logo.png'

export default function Login() {
    const navigate = useNavigate();
    const [registerButton, setRegisterButton] = useState(true)
    const [messageApi, contextHolder] = message.useMessage();
    function gotoHome() {
        navigate('/home');
    }
    const onFinishRegister = (values) => { 
        if (registerButton) {
            setRegisterButton(false)
            Register(values)
                .then(res => {
                    if (res.status == 200) {
                        messageApi.open({
                            type: 'success',
                            content: '注册成功，请登录'
                        });
                        setTimeout(() => {
                            changeStatu()
                        }, 1000);

                    } else {
                        messageApi.open({
                            type: 'warning',
                            content: res.data.message
                        });
                        setRegisterButton(true)
                    }
                })
                .catch(err => {
                    messageApi.open({
                        type: 'warning',
                        content: err.response.data.error,
                    });
                    setRegisterButton(true)
                })
        }

    }
    const changeStatu = () => {
        navigate('/login');
    }


    return (
        <div className='login'>
            {contextHolder}
            <header className='login_header'>
                <div className='head_left'>
                    <img className='logo_img' src={logo} alt="" />
                    <div className='title'>
                        <h1>果果~水果店</h1>
                        <div>
                            简单 <span>|</span>
                            方便 <span>|</span>
                            快捷
                        </div>
                    </div>
                </div>
                <div className='head_right' onClick={gotoHome}>
                    进入网站首页 <DoubleRightOutlined style={{ color: '#666' }}></DoubleRightOutlined>
                </div>
            </header>
            <div className='container'>
                <div className="container_form register_form">
                    <p className='form_title'>账号注册</p>
                    <Form
                        name="basic"
                        labelCol={{
                            span: 6,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                        initialValues={{
                            remember: true,
                        }}
                        autoComplete="off"
                        onFinish={onFinishRegister}
                    >
                        <Form.Item
                            label="用户名"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入您的用户名!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="手机号"
                            name="phone"
                            rules={[
                                {
                                  required: true,
                                  message: '请输入您的手机号!',
                                },
                                {
                                  pattern: /^1[0-9]{10}$/,
                                  message: '请输入有效的手机号',
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
                                    message: '请输入您的密码!',
                                },
                            ]}
                        >
                            <Input.Password autoComplete='off' />
                        </Form.Item>
                        <Form.Item
                            wrapperCol={{
                                // offset: 8,
                                // span: 16,
                            }}
                        >
                            <Button className='form_botton' type="primary" size='large' htmlType="submit">
                                注册
                            </Button>
                        </Form.Item>
                    </Form>
                    <p className='form_tips'>已有账号，去<span className='register' onClick={changeStatu}>登录</span></p>
                </div>
            </div>
        </div>
    )
}
