import React ,{useState,useEffect}from 'react'
import { Link } from 'react-router-dom'
import citrus_sub_logo from '../../assect/citrus_sub_logo.jpg'
import FruitKnowledge from '../../components/FruitKnowledge/FruitKnowledge'
import Fruitems from '../../components/Fruitems/Fruitems'
import {getCategory} from '../../Service/request'


export default function Citrus() {
  const knowledgeInfo = {
    knowledge_title: '柑橘类',
    knowledge_content: '外果皮厚，外表革质，内部分布有许多油腔;中果皮较疏松，具多分枝的维管束;内果皮膜质，分隔成若干囊瓣，其内产生许多多汁的毛囊，为食用的主要部分。有支持消化系统健康、预防肾结石、促进减肥、促进心脏健康等功效。我们常见的柑橘类:橘子、柚子、橙子等等....',
    knowledge_img: citrus_sub_logo,
    // citrus_sub_logo: citrus_sub_logo
  }
  const [citruData,setCitruData] = useState([])
  useEffect(()=>{
    getCitruData()
  },[])
  const getCitruData=()=>{
    getCategory('citru')
    .then(res=>{
      // console.log(res);
    })
  }

  return (
    <div className='category_citrus centre '>
      <FruitKnowledge knowledgeInfo={knowledgeInfo}></FruitKnowledge>
      <div className='category_fruits_list'>
        {
          citruData.map(item => (
            <Link key={item._id} to={`/category/fruit/berry/${item._id}`}>
            <Fruitems fruit_info={item}></Fruitems>
          </Link>
          ))
        }

      </div>
    </div>
  )
}
