import React, { useState ,useEffect} from 'react'
import { Link } from 'react-router-dom'
import FruitKnowledge from '../../components/FruitKnowledge/FruitKnowledge'
import {getCategory} from '../../Service/request'
import perry_logo from '../../assect/drupe_sub_logo.jpg'
import fruit_sub_logo from '../../assect/drupe_sub_logo.jpg'
import Fruitems from '../../components/Fruitems/Fruitems'

export default function Drupe() {
  const knowledgeInfo = {
    knowledge_title: '核果类',
    knowledge_content: '核果（drupe）是由单心皮雌蕊、上位子房形成的果实，亦有由合生心皮雌蕊或下位子房形成。其外果皮薄，中果皮肉质，内果皮坚硬、木质，形成坚硬的果核，每核内含1粒种子。核果类水果有促进机体新陈代谢，具有抗病毒、抗氧化、保护胃肠道等功效。常见的核果类：桃、杏、胡桃等。',
    knowledge_img: perry_logo,
    fruit_sub_logo: fruit_sub_logo
  }
  const [drupeData,setDrupeData] = useState([])
  useEffect(()=>{
    getDrupeData()
  },[])
  const getDrupeData=()=>{
    getCategory('drupe')
    .then(res=>{
      if(res.status == 200){
        setDrupeData(res.data)
      }
    })
  }
  return (
    <div className='category_drupe centre'>
      <FruitKnowledge knowledgeInfo={knowledgeInfo}></FruitKnowledge>
      <div className='category_fruits_list'>
        {
          drupeData.map(item => (
            <Link key={item._id} to={`/category/fruit/berry/${item._id}`}>
              <Fruitems fruit_info={item}></Fruitems>
            </Link>
          ))
        }

      </div>
    </div>
  )
}
