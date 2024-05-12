import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategory } from '../../Service/request'
import FruitKnowledge from '../../components/FruitKnowledge/FruitKnowledge'
import perry_logo from '../../assect/perry_sub_logo.jpg'
import fruit_sub_logo from '../../assect/perry_sub_logo.jpg'
import Fruitems from '../../components/Fruitems/Fruitems'

export default function Berry() {
  useEffect(() => {
    getBerryData()
  }, [])
  const knowledgeInfo = {
    knowledge_title: '浆果类',
    knowledge_content: '浆果是各种颜色的小而柔软的圆形果实——主要是蓝色、红色或紫色。它们的味道或甜或酸，常用于蜜饯、果酱和甜点。浆果往往具有良好的营养成分。它们通常富含纤维、维生素 C 和抗氧化多酚。因此，在饮食中加入浆果可能有助于预防和减轻许多慢性疾病的症状。我们所常见的浆果类：蓝莓、覆盆子、草莓等等....',
    knowledge_img: perry_logo,
    fruit_sub_logo: fruit_sub_logo
  }
  const [berryData, setBerryData] = useState([])
  const getBerryData = () => {
    getCategory('berry')
      .then(res => {
        if (res.status == 200) {
          setBerryData(res.data)
        }
      })
  }


  return (
    <div className='category_berry centre'>
      <FruitKnowledge knowledgeInfo={knowledgeInfo}></FruitKnowledge>
      <div className='category_fruits_list'>
        {
          berryData.map(item => (
            <Link key={item._id} to={`/category/fruit/berry/${item._id}`}>
              <Fruitems fruit_info={item}></Fruitems>
            </Link>

          ))
        }

      </div>
    </div>
  )
}
