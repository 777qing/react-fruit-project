import React from 'react'
import { Button, Modal } from 'antd';
import { baseUrl } from '../../Service/api';
import './OrderInfoModule.css'

export default function OrderInfoModule(props) {
  const { isModalOpen, clickCloseModal, fruitModalData } = props
  const handleCancel = () => {
    clickCloseModal()
  };
  return (
    <div className='order_modal'>
      <Modal title="订单详情" open={isModalOpen}
        onCancel={handleCancel}
        footer={[<Button key="cancel" onClick={handleCancel}>关闭</Button>]}>
        <ul className='fruit_list'>
          {
            fruitModalData.map(item => (
              <li className='list_li' key={item._id}>
                <div>
                  <img className='fruit_img' src={baseUrl + '/' + item.fruit_img[0]} alt="" />
                </div>
                <p>{item.fruit_name}</p>
                <p>{item.specs}</p>
                <p>{item.number}份</p>
              </li>
            ))
          }
        </ul>
      </Modal>
    </div>
  )
}
