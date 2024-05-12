import React, { useState, useEffect } from 'react'
import { Space, Table, Button } from 'antd';
import request from '../../Service/request';
import OrderModal from '../../components/OrderInfoModule/OrderInfoModule'
import './Order.css'


export default function Order() {
  const [orderTable, setOrderTable] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fruitModalData, setFruitModalData] = useState([])
  const [pagination,setPagination] = useState({ 
    current: 1,
    pageSize: 10,
    total: 0,
    hideOnSinglePage: false, // 只有一页时是否隐藏分页器
    showQuickJumper: true, // 是否可以快速跳转至某页
  })
  useEffect(() => {
    getOrderTableData()
  }, [])
  const columns = [
    {
      title: '订单序号',
      dataIndex: 'order_id',
      key: 'order_id',
      render: (_, __, index) => <span>{index + 1}</span>

    },
    {
      title: '收货人姓名',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (_, record) => {
        return (
          <div>
            <p>{record.address.address_name}</p>
          </div>
        );
      }
    },
    {
      title: '收货人电话',
      dataIndex: 'user_name',
      key: 'user_name',
      render: (_, record) => {
        return (
          <div>
            <p>{record.address.address_phone}</p>
          </div>
        );
      }
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      render: (_, record) => (
        <p>{record.address.address_lanels.join(' ')}</p>

      )
    },
    // Table.EXPAND_COLUMN,
    {
      title: '订单信息',
      dataIndex: 'address_info',
      key: 'address_info',
      render: (_, record) => (
        <p className='fruit_info' onClick={() => clickFruiteInfo(record)}>详情</p>
      )
    },
    // Table.SELECTION_COLUMN,
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => (
        <div>
          {record.status ?
            <p className='success_order_statue'>已发货</p> :
            <p className='warning_order_status'>未发货</p>}
        </div>
      )
    },
    {
      title: '下单时间',
      dataIndex: 'order_time',
      key: 'order_time',
      render:(_,record)=>{
        // const utcTime = new Date(record.order_time); // 创建一个 UTC 时间对象
        // const chinaTime = new Date(utcTime.getTime() + 8 * 60 * 60 * 1000); // 增加 8 小时
        // console.log(chinaTime,'chinaTime');
        return formmaterTime(record.order_time); // 返回中国时间
    
      }
    },
    {
      title: '操作',
      key: 'operation',
      dataIndex: 'operation',
      render: (_, record) => (
        <div>
          {
            record.status ?
              <p>已发货</p> : <Button onClick={() => changeOrderStatus(record)} type="primary" >确认发货</Button>
          }
        </div>
      ),
    },
  ];
  const formmaterTime = (value)=>{
    const chinaTime = new Date(value); // 创建一个中国时间对象
    const year = chinaTime.getFullYear();
    const month = (`0${chinaTime.getMonth() + 1}`).slice(-2);
    const day = (`0${chinaTime.getDate()}`).slice(-2);
    const hours = (`0${chinaTime.getHours()}`).slice(-2);
    const minutes = (`0${chinaTime.getMinutes()}`).slice(-2);
    const seconds = (`0${chinaTime.getSeconds()}`).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  const getOrderTableData = () => {
    request.get('/order_form/all_manage')
      .then(res => {
        let total = res.data.length
        setPagination({...pagination,total})
        setOrderTable(res.data)
      })
  }
  const clickFruiteInfo = (record) => {
    let fruits_order = record.fruits_order
    let new_fruits_order = []
    let ids = []
    fruits_order.forEach(item => {
      ids.push(item.id)
    })
    request.get(`/fruits/many_fruits?ids=${JSON.stringify(ids)}`)
      .then(data => {
        data.forEach(e => {
          let new_fruit = fruits_order.find(item => item.id == e._id)
          e.number = new_fruit.number
          new_fruits_order.push(e)
        });
        setFruitModalData(new_fruits_order)
        setIsModalOpen(true)
      })
  }
  const clickCloseModal = () => {
    setIsModalOpen(false)
  }
  const changeOrderStatus = (record) => {
    // console.log(record);
    request.put(`/order_form/edit_status/${record._id}`)
      .then(res => {
        // console.log(res);
        getOrderTableData()
      })
  }
  return (
    <div className='order_manage'>
      <OrderModal isModalOpen={isModalOpen} fruitModalData={fruitModalData} clickCloseModal={clickCloseModal}></OrderModal>
      {/* <Table columns={columns} dataSource={data} /> */}
      <Table rowKey="_id"
      pagination={pagination}
        columns={columns}
        // expandable={{
        //   expandedRowRender: (record) => {
        //     console.log(record);
        //     <ul>
        //     </ul>
        //   },
        // rowExpandable: (record) => record.name !== 'Not Expandable',
        // }
        // }
        dataSource={orderTable}
      />
    </div>
  )
}
