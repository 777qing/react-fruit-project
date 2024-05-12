import React, { useState ,useEffect} from 'react'
import { Link } from 'react-router-dom'
import FruitKnowledge from '../../components/FruitKnowledge/FruitKnowledge'
import {getCategory} from '../../Service/request'
import perry_logo from '../../assect/melon_sub_logo.png'
import fruit_sub_logo from '../../assect/melon_sub_logo.png'
import Fruitems from '../../components/Fruitems/Fruitems'

export default function Melon() {
  const knowledgeInfo = {
    knowledge_title: '瓜类',
    knowledge_content: '瓜类水果是浆果，由子房和花托共同发育而成，属假果类型，此类浆果称为瓠(hù）果。瓜类水果一般含糖量较高，水分大，适合夏季消暑时食用，有生津止咳的作用。我们所常见的瓜类水果：西瓜、甜瓜、蜜瓜等等....',
    knowledge_img: perry_logo,
    fruit_sub_logo: fruit_sub_logo
  }
 const [melonData,setMelonData] = useState([])
 useEffect(()=>{
  getMelonData()
 },[])
 const getMelonData=()=>{
  getCategory('melon')
  .then(res=>{
    if(res.status == 200){
      setMelonData(res.data)
    }
  })
 }
  return (
    <div className='category_drupe centre'>
      <FruitKnowledge knowledgeInfo={knowledgeInfo}></FruitKnowledge>
      <div className='category_fruits_list'>
        {
          melonData.map(item => (
            <Link key={item._id} to={`/category/fruit/berry/${item._id}`}>
              <Fruitems fruit_info={item}></Fruitems>
            </Link>
          ))
        }

      </div>
    </div>
  )
}
