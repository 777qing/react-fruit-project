import React from 'react'
import PropTypes from 'prop-types'
import { BaseURL } from '../../Service/api'
import './Fruitems.css'

export default function Fruitems(props) {
  const { fruit_name, price, special, old_price, fruit_img, buy_num } = props.fruit_info
  // // console.log(props.fruit_info);
  return (
    <div className='fruit_items'>
      <img src={BaseURL + '/' + fruit_img[0]} alt="" />
      <p className='fruit_items_name'>{fruit_name}</p>
      <div className='fruit_items_item_info'>
        <p className='price'>￥{price}</p>
        <p className='specs'>

          {
            special &&
            <span className='older'>原价{old_price}</span>
          }

        </p>
      </div>
      <div className='fruit_items_shopping'>
        <p><span className='buy_num'>{buy_num}</span>人已购买</p>
        <button>加入购物车</button>
      </div>

    </div>
  )
}
Fruitems.propTypes = {
  fruit_info: PropTypes.object
}