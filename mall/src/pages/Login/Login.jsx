import React, { useRef, useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { logIn, Register } from '../../Service/request'
import logo from '../../assect/logo.png'
import './login.css'

export default function Login() {
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    function gotoHome() {
        navigate('/home');
    }
    const onFinishLogin = (values) => {
        logIn(values)
            .then(res => {
                if (res.status == 200) {
                    let user = res.data
                    localStorage.setItem('user_id', user._id)
                    localStorage.setItem('user_name', user.name)
                    navigate('/home', { replace: false })
                } else {
                    messageApi.open({
                        type: 'warning',
                        content: res.data.message
                    });
                }
            })
            .catch(err => {
                messageApi.open({
                    type: 'warning',
                    content: err.response.data.error,
                });
            })
    }
    const changeStatu = () => {
        navigate('/register');
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
                <div className="container_form login_form">
                    <p className='form_title'>账号登录</p>
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
                        onFinish={onFinishLogin}
                    >
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
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                    <p className='form_tips'>没有账号，去<span className='register' onClick={changeStatu}>注册</span></p>
                </div>
            </div>
            <footer className='login_footer'>
                <ul className='footer_info'>
                    <li>关于我们</li>
                    <li>帮助中心</li>
                    <li>售后服务</li>
                    <li>配送与验收</li>
                    <li>商务合作</li>
                    <li>搜索推荐</li>
                    <li>友情链接</li>
                </ul>
            </footer>
        </div>
    )
}
