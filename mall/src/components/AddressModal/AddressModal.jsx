import React, { useRef, useState, useEffect } from 'react'
import { Modal, Form, Input, Switch, Cascader ,message} from "antd";
import city from '../../js/adress'
import { postUserAddress, putUserAddress } from '../../Service/request'

export default function AddressModal(props) {
    const [messageApi, contextHolder] = message.useMessage();
    const user_id = localStorage.getItem('user_id')
    const { TextArea } = Input;
    const { isModalOpen, modalTitle, modalType, clickCloseModal, getUser, address_modal_form } = props
    const [addressLabels, setAddressLabels] = useState([])
    const userAddressRef = useRef()
    useEffect(() => {
        if (Object.entries(address_modal_form).length !== 0) {
            userAddressRef.current.setFieldsValue(address_modal_form)
        }
    }, [address_modal_form])
    const handleSumbit = () => {
        userAddressRef.current.validateFields().then(values => {
            // console.log(values);
            values.address_labels = addressLabels
            if (modalType == 'add') {
                postUserAddress(user_id, values)
                    .then(user => {
                        // console.log(user);
                        if (user.status == 200) {
                            messageApi.open({
                                type: 'success',
                                content: '添加成功',
                              });
                            handleCancel()
                            getUser()
                        }
                    })
            } else if (modalType == 'edit') {
                values.address_labels = addressLabels
                putUserAddress(user_id, address_modal_form._id, values)
                    .then(res => {
                        if (res.status == 200) {
                            messageApi.open({
                                type: 'success',
                                content: '修改成功',
                              });
                            handleCancel()
                            getUser()
                        }
                    })
            }

        }).catch(errorInfo => {
            // console.log('Validation failed:', errorInfo);
        });
    };
    const handleCancel = () => {
        userAddressRef.current.resetFields()
        clickCloseModal()
    };
    const onChangeCity = (value, selectedOptions) => {
        const labels = selectedOptions.map(option => option.label);
        setAddressLabels(labels)
    };
    const onChangeDefault = (value)=>{

    }
    const onFinish = (values) => {
        // console.log('Success:', values);
    };
    const onFinishFailed = (errorInfo) => {
        // console.log('Failed:', errorInfo);
    };
    return (
        <div className='address_modal'>
            {contextHolder}
            <Modal title={modalTitle} open={isModalOpen} onOk={handleSumbit} onCancel={handleCancel}>
                <Form
                    ref={userAddressRef}
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
                        label="是否默认地址"
                        name="address_default"
                        initialValue={false} // 设置初始值为 false
                    >
                        <Switch  onChange={onChangeDefault} />
                        
                    </Form.Item>


                    <Form.Item
                        label="收货人"
                        name="address_name"
                        rules={[
                            {
                                required: true,
                                message: '请输入收货人姓名!',
                            },
                        ]}
                    >
                        <Input />
                    
                    </Form.Item>


                    <Form.Item
                        label="收货电话"
                        name="address_phone"
                        rules={[
                            {
                                required: true,
                                message: '请输入收货电话!',
                            }, {
                                pattern: /^1[0-9]{10}$/,
                                message: '请输入有效的手机号',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="收货地址"
                        name="address_city"
                        rules={[
                            {
                                required: true,
                                message: '请输入收获地址!',
                            },
                        ]}
                    >
                        <Cascader options={city} onChange={onChangeCity} />
                    </Form.Item>
                    <Form.Item
                        label="详细地址"
                        name="address_detailed"
                        rules={[
                            {
                                required: true,
                                message: '请输入收货详细地址!',
                            },
                        ]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    )
}
