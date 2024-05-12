import React,{useRef,useEffect} from 'react'
import { Card, Form, Input, Button,message } from "antd";
import {putUserInfo} from '../../Service/request'
import './UserInfo.css'

export default function UserInfo(props) {
    const { user,getUser } = props
    const userRef = useRef()
    const [messageApi, contextHolder] = message.useMessage();
    useEffect(()=>{
        userRef.current.setFieldsValue(user || {});
        userRef.current.setFieldsValue({
            password: '',
            modify_password:''
          });
    },[user])
    const onFinish = () => {
        userRef.current.validateFields()
        .then(user=>{
            putUserInfo(localStorage.getItem('user_id'),user)
            .then(res=>{
                if(res.status == 200){
                    messageApi.open({
                        type: 'success',
                        content: '修改成功',
                      });
                      getUser()
                }
            })
            .catch(err=>{
                messageApi.open({
                    type: 'warning',
                    content: err.response.data.error,
                  });
            })
        })
    }
    return (
        <div className='user_info'>
            {contextHolder}
            <ul className='user_show'>
                <Card title="用户信息">
                    <li><span>用户名：</span>{user.name}</li>
                    <li><span>账号：</span>{user.phone}</li>
                </Card>
            </ul>
            <div className='edit_user'>
                <Card>
                    <Form
                    ref={userRef}
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                   
                    style={{
                        maxWidth: 600,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="手机号"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: '请输入手机号!',
                            },
                        ]}
                    >
                        <Input  disabled/>
                    </Form.Item>
                    <Form.Item
                        label="用户名"
                        name="name"
                        rules={[
                            { 
                                required: true,
                                message: '请输入用户名!',
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
                        <Input.Password autoComplete='off'/>
                    </Form.Item>
                    <Form.Item
                        label="修改密码"
                        name="modify_password"
                        rules={[
                            {
                                message: '如有需要请输入您要修改的密码!',
                            },
                        ]}
                    >
                        <Input.Password autoComplete='off'/>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                    </Form.Item>
                </Form></Card>

            </div>
        </div>
    )
}
