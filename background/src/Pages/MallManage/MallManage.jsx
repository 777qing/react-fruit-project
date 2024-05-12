import React, { useState,useEffect } from 'react'
import { Table, Button,message,Pagination } from 'antd';
import request from '../../Service/request';
import {baseUrl} from '../../Service/api'
import FruitModule from '../../components/FruitModule/FruitModule';
import './mallmanage.css'

export default function MallManage() {
  const columns = [
    {
      title: '水果',
      dataIndex: 'fruit_img',
      key: 'fruit_img',
      width:'130px',
      render: (_, record) => (
        <div>
        <img className='table_fruit_img' src={`${baseUrl}/${record.fruit_img}`} alt="" />
        </div>
       
      )
    },
    {
      title: '水果',
      dataIndex: 'fruit_name',
      key: 'fruit_name',
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      render: (text) => {
        let categoryText = '';
        switch (text) {
          case 'berry':
            categoryText = '浆果类';
            break;
          case 'citrus':
            categoryText = '柑橘类';
            break;
          case 'renguo':
            categoryText = '仁果类';
            break;
          case 'drupe':
            categoryText = '核果类';
            break;
          case 'melon':
            categoryText = '瓜类';
            break;
          default:
            categoryText = '未知类别';
            break;
        }
        return <p >{categoryText}</p>;
      }
    },
    {
      title: '是否特价',
      dataIndex: 'special',
      key: 'special',
      render: (text) => (
        text ? '是' : '否'
      )
    },
    {
      title: '价格',
      key: 'price',
      dataIndex: 'price',
    },
    {
      title: '原价格',
      key: 'old_price',
      dataIndex: 'old_price',
    },
    {
      title: '规格',
      key: 'specs',
      dataIndex: 'specs',
    },
    {
      title: '操作',
      key: 'operation',
      render: (_, record) => {
        return (
        manage_identity != '普通员工' ?
        <div>
          <Button type="primary" onClick={() => editFruitInfo(record)}>编辑</Button>
          <Button type="primary" danger onClick={()=>deleteFruit(record)} >删除</Button>
        </div>
        :
        <div></div>)
      },
    },
  ];
  const manage_identity = localStorage.getItem('identity')
  const manage_id = localStorage.getItem('manage_id')
  const [messageApi, contextHolder] = message.useMessage();
  const [fruitData,setFruitData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState('add')
  const [modalTitle, setModalTitle] = useState('添加新水果')
  const [initFruitForm, setInitFruitForm] = useState({
    fruit_img: '',
    fruit_name: '',
    category: '',
    special: false,
    price: '',
    old_price: '',
    specs: '',
  })
  const [pagination,setPagination] = useState({ 
    // size: 'large',
    current: 1,
    pageSize: 6,
    total: 0,
    // pageSizeOptions: ['10', '20', '30'], // 可选的页面显示条数
    // showTotal: (total, range) => {
    //   return range[0] + '-' + range[1] + ' 共' + total + '条'
    // }, // 展示每页第几条至第几条和总数
    hideOnSinglePage: false, // 只有一页时是否隐藏分页器
    showQuickJumper: true, // 是否可以快速跳转至某页
    // showSizeChanger: true // 是否可以改变pageSize
  })

  useEffect(()=>{
    getFruitsData()
  },[])

  const addNewFruit = () => {
    setIsModalOpen(true)
    setModalType('add')
  }
  const editFruitInfo = (record) => {
    setInitFruitForm({ ...record})
    setIsModalOpen(true)
    setModalTitle('编辑水果信息')
    setModalType('edit')
  }
  const deleteFruit=(record)=>{
    console.log(record);
    request.delete(`/fruits/delete/${record._id}`)
    .then(data=>{
      if(data.status == 200){
        messageApi.open({
          type: 'success',
          content: '删除成功',
        });
        getFruitsData()
      }
    })
  }
  const closeModal = () => {
    setModalTitle('添加新水果')
    setIsModalOpen(false)
  }
  const getFruitsData = ()=>{
    request.get('/fruits/all')
    .then(res=>{
      if(res.status == 200){
        let total = res.data.length
        setPagination({...pagination,total})
        setFruitData(res.data)
      }
    })
    .catch(err=>{
      messageApi.open({
        type: 'warning',
        content: err,
      });
    })
  }
  const handleTableChange =(e)=>{
    setPagination(e)
  }
  return (
    <div className='mall_manage'>
      {contextHolder}
      <div className="mall_top">
        <Button type="primary" disabled={manage_identity == '普通员工'} onClick={addNewFruit}>添加新水果</Button>
        <FruitModule fruit_module_form={initFruitForm} modalTitle={modalTitle} isModalOpen={isModalOpen} modalType={modalType} closeModal={closeModal} getFruitsData={getFruitsData}></FruitModule>
      </div>
      <Table columns={columns} pagination={pagination} dataSource={fruitData}  rowKey="_id" onChange={handleTableChange} />
    </div>
  )
}
