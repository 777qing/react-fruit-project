import React, { useEffect, useState } from 'react'
import { Carousel } from 'antd';
import { DoubleRightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import TopInfo from '../../components/TopInfo/TopInfo'
import HomeTopNav from '../../components/TopNav/TopNav'
import HomeNew from '../../components/HomeNew/HomeNew'
import { getAllFruits, getSpecial } from '../../Service/request'
import logo from '../../assect/16pic_9041480_b.jpg'
import './Home.css'

// swiper
export default function Home() {
  const contentStyle = {
    height: '500px',
    width: '100%',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };
  const [newFruit, setNewFruit] = useState([])
  const [buyFruit, setBuyFruit] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    getModuleData()
  }, [])

  // 最新时间排序
  function compareTime(obj1, obj2) {
    // 转为时间戳
    const time1 = new Date(obj1.time).getTime();
    const time2 = new Date(obj2.time).getTime();
    // 按照时间的新旧进行排序，最新的时间排在前面
    if (time1 > time2) {
      return -1;
    } else if (time1 < time2) {
      return 1;
    } else {
      return 0;
    }
  }
  // 购买排序
  function sortByBuyNum(fruits) {
    // 先将购买数量不为0的水果放在前面
    const nonZeroBuyNum = fruits.filter(fruit => fruit.buy_num !== 0);
    // 将购买数量为0的水果放在后面
    const zeroBuyNum = fruits.filter(fruit => fruit.buy_num === 0);
    // 对购买数量不为0的水果按照购买数量大小进行排序
    nonZeroBuyNum.sort((a, b) => b.buy_num - a.buy_num);
    // 合并两个数组
    const sortedFruits = nonZeroBuyNum.concat(zeroBuyNum);
    return sortedFruits;
  }

  const getModuleData = () => {
    getAllFruits()
      .then(res => {
        // 修改第一个data
        const sortedTimeArray = res.data.data.slice().sort(compareTime);
        setNewFruit(sortedTimeArray.slice(0, 4))
        const sortedBuyArray = sortByBuyNum(res.data.data)

        setBuyFruit(sortedBuyArray.slice(0, 4))

        // // console.log(sortedArray,sortedArray.slice(0, 4)); // 输出排序后的新数组
      })
  }
  const clickSpecial = () => {
    // console.log('88');
    getSpecial()
      .then(res => {
        // console.log(res);
        if (res.status == 200) {
          navigate('/other', {
            state: {
              fruit_data: JSON.stringify(res.data)
            }
          })
        }
      })
  }
  return (
    <div>
      <TopInfo></TopInfo>
      <HomeTopNav></HomeTopNav>
      <div className='home'>

        <div className='centre home_carousel'>
          <Carousel autoplay>
            <div>
              <img style={contentStyle} src={logo} alt="" />
            </div>
            <div>
              <img style={contentStyle} src={logo} alt="" />
            </div>
            <div>
              <img style={contentStyle} src={logo} alt="" />
            </div>
            <div>
              <img style={contentStyle} src={logo} alt="" />
            </div>
          </Carousel>
        </div>
        <div className="centre home_special_offer">
          <div className='special_top'>
            <p className='title'>每日新品特卖</p>
            <p className='desc'>新鲜水果每一天，健康生活每一刻</p>
          </div>
          <div className='special_good'>
            <div className='details'>
              <p>有机生鲜</p>
              <p>天然无污染水果</p>
              <p className='special_number'><span>6.8折</span>起</p>
              <p className='mode_special' onClick={clickSpecial}>查看详情 <DoubleRightOutlined twoToneColor="#eb2f96" /></p>
            </div>
            <div className='good'>
              <img src={logo} alt="" />
            </div>
          </div>
        </div>
        <div className='home_module'>
          <HomeNew title="新鲜好物" sub_titke="新鲜出炉 品质靠谱" fruit_data={newFruit}></HomeNew>
          <HomeNew title="人气推荐" sub_titke="人气最佳 新鲜好吃" fruit_data={buyFruit}></HomeNew>
        </div>

      </div>

    </div>
  )
}
