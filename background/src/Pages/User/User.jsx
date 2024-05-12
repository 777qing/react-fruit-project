import React, { useState, useEffect } from 'react'
import { Table, Button, message } from 'antd';
import request from '../../Service/request';
import UserModule from '../../components/UserModule/UserModule'
import './User.css'


export default function User() {
  const manage_identity = localStorage.getItem('identity')
  const manage_id = localStorage.getItem('manage_id')
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      // render: (text) => <a>{text}</a>,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '身份',
      dataIndex: 'identity',
      key: 'identity',
    },

    {
      title: '操作',
      key: 'action',
      render: (text, record) => {
        let actionButtons = null;
        switch (manage_identity) {
          case "超级管理员":
            actionButtons = (
              <div>
                <Button type="primary" onClick={() => editManage(record)}>编辑</Button>
                <Button type="primary" onClick={() => deleteManage(record)} danger>删除</Button>
              </div>
            );
            break;
          default:
            if (record._id == manage_id) {
              actionButtons = (
                <div>
                  {/* 只显示编辑按钮 */}
                  <Button type="primary" onClick={() => editManage(record)}>编辑</Button>
                </div>
              );
            }
        }

        return (
          <div>
            {/* <p>{record.name}</p> */}
            {actionButtons}
          </div>
        );
      },

    },
  ];
  const [messageApi, contextHolder] = message.useMessage();
  const [manageData, setManageData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initUserForm, setInitUserForm] = useState({ name: '', phone: '', identity: '' })
  const [userModuleTitle, setUserModuleTitle] = useState('添加管理员')
  const [moduleType, setModuleType] = useState('add')
  const addUserMange = () => {
    setIsModalOpen(true);
    setUserModuleTitle('添加管理员');
    setModuleType('add')
  };

  const editManage = (record) => {
    setInitUserForm({ ...record, password: '' })
    console.log(initUserForm, 'initUserForm');
    setIsModalOpen(true);
    setUserModuleTitle('编辑管理员');
    setModuleType('edit')
  }
  const deleteManage = (record) => {
    request.delete(`/manages/delete/${record._id}`)
      .then(res => {
        if (res.status == 200) {
          messageApi.open({
            type: 'success',
            content: '删除成功',
          });
          getManageAll()
        }else{
          messageApi.open({
            type: 'warning',
            content: res.error,
          });
        }
      })
      .catch(error => {
        messageApi.open({
          type: 'warning',
          content: error.error,
        });
      })
  }

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    getManageAll()
  }, []);
  const getManageAll = () => {
    request.get('/manages/all')
      .then(res => {
        // console.log(res);
        if (res.status == 200) {
          setManageData(res.data)
        }
      })
      .catch(error => {
        messageApi.open({
          type: 'warning',
          content: error.error,
        });
      });

  }


  return (
    <div className='user_manage'>
      {contextHolder}
      <div className='user_top'>
        <Button type="primary" disabled={manage_identity != '超级管理员'} onClick={addUserMange}>添加管理员</Button>
        <UserModule moduleType={moduleType}
          userModuleTitle={userModuleTitle}
          isModalOpen={isModalOpen}
          user_module_form={initUserForm}
          handleCancel={handleCancel} getManageAll={getManageAll}></UserModule>
      </div>
      <div className='user_table'>
        <Table columns={columns} dataSource={manageData} rowKey="_id" />
      </div>

    </div>
  )
}
