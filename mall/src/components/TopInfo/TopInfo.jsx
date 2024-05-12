import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './TopInfo.css'

export default function TopInfo() {
    const navigate = useNavigate();
    const [isLogIn, setIsLogIn] = useState(false)
    const [userName, setUserName] = useState('')
    useEffect(() => {
        if (localStorage.getItem('user_id')) {
            setIsLogIn(true)
            setUserName(localStorage.getItem('user_name'))
        }
    }, [])

    const gotoLogin = () => {
        navigate('/login', { replace: false })
    }
    const clickUserMain =()=>{
        navigate('/user_main',{replace:false})
    }
    const logOut = () => {
        localStorage.removeItem('user_id')
        localStorage.removeItem('user_name')
        setIsLogIn(false)
        setUserName('')
        // navigate('/login', { replace: false })
    }
    return (
        <div className='top_info centre'>
            <ul>
                { }
                <li>
                    {
                        userName ||
                        <p onClick={gotoLogin}>请先登录</p>

                    }
                </li>
                {isLogIn && <li onClick={logOut}>退出登录</li>}
                <li>帮助中心</li>
                {
                    isLogIn ? <li onClick={clickUserMain}>用户中心</li> : <li>关于我们</li>
                }

            </ul>
        </div>
    )
}
