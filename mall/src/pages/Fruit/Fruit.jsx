import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs ,message} from 'antd';
import { BaseURL } from '../../Service/api'
import { getFruit, addShopping } from '../../Service/request';
import './Fruit.css'
const onChange = (key) => {
  // console.log(key);
};
const items = [
  {
    key: '1',
    label: '商品详情',
    children: <ProductDetails />,
  },
  {
    key: '2',
    label: '买家评论',
    children: 'Content of Tab Pane 2',
  },
  {
    key: '3',
    label: '配送地址',
    children: 'Content of Tab Pane 3',
  },
];
export default function Fruit(props) {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage();
  const user_id = localStorage.getItem('user_id')
  const [fruitInfo, setFruitInfo] = useState({})
  const { fruit_id } = useParams()
  useEffect(() => {
    getFruitItem()
  }, [])
  const getFruitItem = () => {
    getFruit(fruit_id)
      .then(res => {
        if (res.status == 200) {
          // console.log(res, res.data);
          setFruitInfo({ ...res.data.data })
        }
      })
    // // console.log(fruitInfo);
  }
  const addShoppingCar = () => {
    if (localStorage.getItem('user_id')) {
      // // console.log(fruitInfo, { ...fruitInfo, fruit_id: fruitInfo._id });
      addShopping({ ...fruitInfo, fruit_id: fruitInfo._id }, user_id)
        .then(res => {
          if(res.status == 200){
            messageApi.open({
              type: 'success',
              content: '添加成功',
            });
          }
        })
        .catch(err=>{
          messageApi.open({
            type: 'warning',
            content: err.response.data.error,
          });
        })
    } else {
      // console.log('iii');
      navigate('/login', { replace: false })
    }

  }
  return (
    <div className='fruit centre'>
      {contextHolder}
      <div className='fruit_goods_introduce'>
        <img src={BaseURL + '/' + fruitInfo.fruit_img} alt="" />
        <div className='fruit_goods_right_main'>
          <div className="fruit_info">
            <p className='fruita_name'>{fruitInfo.fruit_name}</p>
            <div className='price_module'>
              <p className='text_letter'>价格</p>
              <p className='price'>￥{fruitInfo.price}</p>
              <div className='price_module_info'>
                {
                  fruitInfo.old_price &&
                  <p className='old_price'>￥{fruitInfo.old_price}</p>
                }

                <p className='desc'>{fruitInfo.specs}</p>
              </div>

            </div>
          </div>
          {/* <div className="fruit_specs_list ">
            <p className='fruit_specs_list_title'>数量</p>
            <ul className='specs_module'>
              <li className='other_specs select_specs'>
                ￥40.00 400g
              </li>
              <li className='other_specs'>
                ￥40.00 400g
              </li>
              <li className='other_specs'>
                ￥40.00 400g
              </li>
              <li className='other_specs'>
                ￥40.00 400g
              </li>
              <li className='other_specs'>
                ￥40.00 400g
              </li>
            </ul>


          </div> */}
          <div className='fruit_appraise'>
            <p>已有<span className='buy_num'>{fruitInfo.buy_num}</span>人购买</p>
            <p>共有<span className='evaluate'>2</span>条评论</p>
          </div>
          <div className='fruit_buy'>
            <p className='text_letter'>购买</p>
            <div className='add_car' onClick={addShoppingCar}>加入购物车</div>
          </div>
        </div>
      </div>
      <div className='fruit_goods_details'>
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div>
    </div>
  )
}

function ProductDetails() {
  return (
    <div>

    </div>
  )
}
