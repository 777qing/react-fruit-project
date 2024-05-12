import React from 'react'
import { useParams, Routes, Route, Navigate, Link, Outlet } from 'react-router-dom'
import TopInfo from '../../components/TopInfo/TopInfo'
import TopNav from '../../components/TopNav/TopNav'
import Berry from '../Berry/Berry'

export default function Category() {
    const { title } = useParams()
    return (

        <div className='category'>
            <TopInfo></TopInfo>
            <TopNav></TopNav>
            {/* <Link className="li" to='berry'>浆果类</Link> */}
            {title}
            <Outlet></Outlet>
            {/* <Routes>
                <Route path='/category/berry' element={<Berry />}></Route>
            </Routes> */}

        </div>
    )
}
