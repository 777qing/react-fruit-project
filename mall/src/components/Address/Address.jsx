import React, { useState } from 'react'
import { Cascader, Button, message } from 'antd';
import AddressModal from '../AddressModal/AddressModal';
import { deleteUserAddress } from '../../Service/request'
import './Address.css'

export default function Address(props) {
  const user_id = localStorage.getItem('user_id')
  const { user, getUser } = props
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('添加新地址')
  const [modalType, setModalType] = useState('add')
  const [messageApi, contextHolder] = message.useMessage();
  const [initAddressModal, setInitAddressModal] = useState({})
  // // console.log(user.address);
  const clickCloseModal = () => {
    setIsModalOpen(false)
    setInitAddressModal({})
  }
  const addNewAddress = () => {
    setIsModalOpen(true)
    setModalTitle('添加新地址')
    setModalType('add')
  }
  const editAddress = (item) => {
    // // console.log(item);
    setInitAddressModal(item)
    setModalTitle('编辑地址')
    setModalType('edit')
    setIsModalOpen(true)
  }
  const deleteAddress = (item) => {
    deleteUserAddress(user_id, item._id)
      .then(res => {
        if (res.status == 204) {
          messageApi.open({
            type: 'success',
            content: '删除成功',
          });
          getUser()
        }
      })
  }
  return (
    <div className='address'>
      {contextHolder}
      <AddressModal isModalOpen={isModalOpen} modalTitle={modalTitle} modalType={modalType} clickCloseModal={clickCloseModal} getUser={getUser} address_modal_form={initAddressModal}></AddressModal>
      <div className="tap_area">
        <Button type="primary" onClick={addNewAddress}>添加新地址</Button>
        {/* <Cascader  options={city} onChange={onChange} /> */}
      </div>
      <ul className="address_list">
        {

          user.address.map(item => (
            <li key={item._id}>
              <div>
                <p className='user'>{item.address_name} {item.address_phone} {item.address_default && <span className='is_default'>默认</span>}</p>
                <p className='address_info'>{item.address_labels.join(' ')} {item.address_detailed}</p>

              </div>
              <div>
                <Button onClick={() => editAddress(item)}>编辑</Button>
                <Button className='delete_button' onClick={() => deleteAddress(item)}>删除</Button>
              </div>

            </li>
          ))}
        {/* <li>
          <div>
            <p className='user'>张三 11111111111</p>
            <p className='phone'>12132132</p>
          </div>
          <Button>删除</Button>
        </li> */}
      </ul>
    </div>
  )
}
