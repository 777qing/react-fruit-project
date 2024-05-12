import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import './HomeNew.css'
import { BaseURL } from '../../Service/api';
import good_img from '../../assect/home_modle_img1.jpg'

export default function Module(props) {
  const navigate = useNavigate()
  const { title, sub_title, fruit_data } = props
  // 只有在 fruit_data 存在且不为空的情况下才渲染相关内容
  if (!fruit_data || fruit_data.length === 0) {
    return null; // 或者你可以返回一些加载中的提示信息
  }

  const clickFruitItem = (fruit) => {
    // console.log(fruit);
    navigate(`/category/fruit/${fruit.category}/${fruit._id}`,{replace:false})
  }
  return (
    <div className='module centre'>
      <div className='title'>
        <h3>{title}</h3>
        <span>{sub_title}</span>
      </div>
      <ul className='module_goods'>
        {fruit_data.map((fruit, index) => (
          <li onClick={() => clickFruitItem(fruit)} key={index} className='goods_item'>
            <img src={BaseURL + '/' + fruit.fruit_img[0]} alt='' />
            <p className='name'>{fruit.fruit_name}</p>
            <p className='price'>￥{fruit.price}/{fruit.specs}</p>
          </li>
        ))}
      </ul>

    </div>
  )
}

Module.propTypes = {
  title: PropTypes.string,
  sub_titke: PropTypes.string,
  fruit_data: PropTypes.array,
};