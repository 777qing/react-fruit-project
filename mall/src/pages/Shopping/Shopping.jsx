import React, { useState, useEffect } from 'react'
import { Table, Button,message } from 'antd';
import { Link, useNavigate } from 'react-router-dom'
import TopInfo from '../../components/TopInfo/TopInfo'
import TopNav from '../../components/TopNav/TopNav'
import { getShopping, putFuitNumber, deleteShopFruit } from '../../Service/request'
import { BaseURL } from '../../Service/api'
import './Shopping.css'


export default function Shopping() {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [shoppingTable, setShoppingTable] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  useEffect(() => {
    getShoppingData()
  }, [])

  // 表格表头
  const columns = [
    {
      title: '产品信息',
      dataIndex: 'name',
      render: (text, record) => (
        <div className='table_title'>
          <img src={`${BaseURL}/${record.fruit_img}`} alt="" />
          <p>{record.fruit_name}</p>
        </div>
      )
    },
    {
      title: '单价',
      dataIndex: 'price',
      render: (text, record) => (
        <div className='table_price'>
          <p>￥{text}</p>
        </div>
      )
    },
    {
      title: '数量',
      dataIndex: 'number',
      render: (text, record) => (
        <div className='table_number'>
          <Button className='sub_number' onClick={() => handleFruitNumber(record, 'sub')}>-</Button>
          <span className='number'>{text}</span>
          <Button className='add_number' onClick={() => handleFruitNumber(record, 'add')}>+</Button>

        </div>

      ),
    },
    {
      title: '规格',
      dataIndex: 'specs',
      render: (text, record) => (
        <div>
          <p>{text}</p>
        </div>
      )
    },
    {
      title: '小计',
      dataIndex: 'sum_price',
      render: (text, record) => (
        <div className='table_price'>
          <p>￥{Number((record.price * record.number).toFixed(2))}</p>
        </div>
      )
    },
    {
      title: '删除',
      dataIndex: 'sum_price',
      render: (text, record) => (
        <div className='table_operation'>
          <Button className='operation_delete' onClick={() => handleDeleteFruit(record)}>删除</Button>
        </div>

      ),
    },
  ];
  const handleButtonClick = () => {
    // console.log(shoppingTable);
    let order = []
    selectedRowKeys.forEach(item=>{
      let fruit = shoppingTable.find(e =>e.id == item)
      order.push(fruit)
    })

    if (selectedRowKeys.length) {
      // console.log('oo');
      navigate('/balance',{
        replace:false,
        state:{
          order_data:JSON.stringify(order)
        }
      })
    }
    messageApi.open({
      type: 'error',
      content: '请选择需要购买的商品！',
    });

    // navigate('balance',)

  }
  const handleDeleteFruit = (record) => {
    let user_id = localStorage.getItem('user_id')
    deleteShopFruit(user_id, record.id)
      .then(res => {
        if (res.status == 204) {
          // // console.log(res, res.data);
          messageApi.open({
            type: 'success',
            content: '删除成功',
          });
          const newTable = shoppingTable.filter(item => item.id !== record.id);
          setShoppingTable(newTable); // 更新状态
        }
      })
      .catch(err => {
        // console.log(err);
        messageApi.open({
          type: 'warning',
          content: err.response.data.error,
        });
      })



  }
  const handleFruitNumber = (record, type) => {
    let newNum = record.number
    if (type == 'add') {
      newNum += 1
    } else if (type == 'sub' && newNum != 1) {
      newNum -= 1
    } else if (type == 'sub' && newNum == 1) {
      return
    }
    let item = shoppingTable.findIndex(item => item.id == record.id)
    if (item !== -1) {
      let updatedShoppingTable = [...shoppingTable]; // 创建副本以避免直接修改状态
      updatedShoppingTable[item].number = newNum; // 更新匹配项的 number 属性
      setShoppingTable(updatedShoppingTable); // 更新状态
      let data = {
        number: newNum,
        id: record.id
      }
      putFuitNumber(localStorage.getItem('user_id'), data)
        .then(res => {
          // console.log(res);
        })

      onSelectChange(selectedRowKeys)
    }


  }
  const getShoppingData = () => {
    let user_id = localStorage.getItem('user_id')
    getShopping(user_id)
      .then(res => {
        setShoppingTable(res.data)
      })
  }
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    let total_num = 0
    newSelectedRowKeys.forEach(element => {
      let item = shoppingTable.find(item => item.id == element)
      total_num += Number((item.price * item.number).toFixed(2))
    });
    setTotalPrice(total_num)
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  return (
    <div>
      {contextHolder}
      <TopInfo></TopInfo>
      <TopNav></TopNav>
      <div className='shopping centre'>
        <Table rowSelection={rowSelection} columns={columns} dataSource={shoppingTable} rowKey="id" />
        <div className='shopping_sum'>
          <p>合计：</p>
          <p className='sum_price'>￥{totalPrice}</p>
          <Button className='shopping_sum_button' onClick={() => handleButtonClick()}>购买</Button>
        </div>
      </div>

    </div>
  )
}
