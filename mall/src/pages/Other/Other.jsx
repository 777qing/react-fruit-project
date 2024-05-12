import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import TopInfo from '../../components/TopInfo/TopInfo'
import TopNav from '../../components/TopNav/TopNav'
import Fruitems from '../../components/Fruitems/Fruitems'

export default function Other() {
  const { state: { fruit_data } } = useLocation()
  const [fruitData, setFruitData] = useState([])
  // console.log(JSON.parse(fruit_data));
  return (
    <div>
      <TopInfo></TopInfo>
      <TopNav></TopNav>
      <div className='centre'>
        <div className='category_fruits_list other_main'>
          {
            JSON.parse(fruit_data).map(item => (

              <Link key={item._id} to={`/category/fruit/${item.category}/${item._id}`}>
                <Fruitems fruit_info={item}></Fruitems>
              </Link>
            ))
          }
        </div>
      </div>

    </div>
  )
}
