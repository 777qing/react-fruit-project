import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Select, Form, Input, Modal, message } from 'antd';
import request from '../../Service/request'
const { Option } = Select;


export default function UserModule(props) {
  const [form] = Form.useForm();
  const userRef = useRef()
  const [messageApi, contextHolder] = message.useMessage();
  let { moduleType, userModuleTitle, user_module_form, isModalOpen, handleCancel, getManageAll } = props
  useEffect(() => {
    userRef.current.setFieldsValue(user_module_form || {});
  }, [user_module_form]);



  const onGenderChange = (value) => {
    form.setFieldsValue({
      identity: value,
    });
  };



  const c_handleOk = () => {
    userRef.current.validateFields().then(values => {
      if (moduleType == 'add') {
        request.post('/manages/register', values)
          .then(res => {
            console.log(res);
            if (res.status == 200) {
              c_handleCancel()
              getManageAll()
              messageApi.open({
                type: 'success',
                content: '添加新管理员成功',
              });
            } else {
              messageApi.open({
                type: 'warning',
                content: res.error,
              });
            }
          })
          .catch(err => {
            messageApi.open({
              type: 'warning',
              content: err.error,
            });
          })

      } else if (moduleType == 'edit') {
        request.post('/manages/edit', { ...values, _id: user_module_form._id })
          .then(data => {
            console.log(data);
            if (data.status == 200) {
              c_handleCancel()
              getManageAll()
              messageApi.open({
                type: 'success',
                content: '编辑成功',
              });
            } else {
              messageApi.open({
                type: 'warning',
                content: data.errors,
              });
            }
          })
          .catch(err => {
            messageApi.open({
              type: 'warning',
              content: err.error,
            });
          })
      }
    }).catch(errorInfo => {
      console.log('Validation failed:', errorInfo);
    });
  };
  const c_handleCancel = () => {
    handleCancel()
    userRef.current.resetFields()
  };

  return (
    <div>
      {contextHolder}
      <Modal title={userModuleTitle} open={isModalOpen} onOk={c_handleOk} onCancel={c_handleCancel} forceRender={true}>
        <Form
          ref={userRef}
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
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="名称"
            name="name"
            rules={[
              {
                required: true,
                message: '请输入您的名称!',
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
            <Input.Password autoComplete="off" />
          </Form.Item>
          {
            moduleType == 'edit' &&
            <Form.Item
              label="修改密码"
              name="modify_password"
            >
              <Input.Password autoComplete="off" />
            </Form.Item>
          }
          <Form.Item
            name="identity"
            label="身份"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              placeholder="选择您的身份"
              onChange={onGenderChange}
              allowClear
            // disabled
            >
              <Option value="超级管理员">超级管理员</Option>
              <Option value="管理员">管理员</Option>
              <Option value="普通员工">普通员工</Option>
            </Select>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
UserModule.propTypes = {
  moduleType: PropTypes.string.isRequired,
  userModuleTitle: PropTypes.string.isRequired,
  isModalOpen: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func,
  getManageAll: PropTypes.func
}

