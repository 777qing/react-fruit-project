import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import FruitKnowledge from '../../components/FruitKnowledge/FruitKnowledge'
import { getCategory } from '../../Service/request'
import perry_logo from '../../assect/renguo_sub_logo.png'
import fruit_sub_logo from '../../assect/renguo_sub_logo.png'
import Fruitems from '../../components/Fruitems/Fruitems'
export default function Renguo() {
  const knowledgeInfo = {
    knowledge_title: '仁果类',
    knowledge_content: '仁果，由合生心皮下位子房与花托、萼筒共同发育而成的肉质果。属假果。主要食用部分起源于花托和萼筒，子房所占比例较小。有齿宜常叩、津宜常咽”之功效，加上果仁本身营养物质的功效，使人体获得 固齿 、 补益 、养身的功效。仁果类包括有苹果、梨、山楂、枇杷等。',
    knowledge_img: perry_logo,
    fruit_sub_logo: fruit_sub_logo
  }
  const [renguoData, setRenguoData] = useState([])
  useEffect(() => {
    getRenguoData()
  }, [])
  const getRenguoData = () => {
    getCategory('renguo')
      .then(res => {
        // console.log(res);
        if(res.data == 200){
          setRenguoData(res.data)
        }
      })
  }
  return (
    <div className='category_renguo centre'>
      <FruitKnowledge knowledgeInfo={knowledgeInfo}></FruitKnowledge>
      <div className='category_fruits_list'>
        {
          renguoData.map(item => (
            <Link key={item._id} to={`/category/fruit/berry/${item._id}`}>
            <Fruitems fruit_info={item}></Fruitems>
          </Link>
          ))
        }

      </div>
    </div>
  )
}
