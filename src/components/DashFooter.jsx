import React from 'react'
import {  useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineHome } from 'react-icons/ai'
import useAuth from '../hooks/useAuth'


const DASH_REGEX = /^\/dash(\/)?$/

const DashFooter = () => {
    const { pathname } = useLocation()
    const { username,status } = useAuth()
    const navigate = useNavigate()
    // console.log(pathname)
    let homeButton = null
    const homeButtonClick = () => {
        navigate('/dash')
    }
    if (!DASH_REGEX.test(pathname)) {
        homeButton = (
            <button className='text-2xl md:text-3xl transition-all duration-200 hover:text-blue-600'
                onClick={homeButtonClick}><AiOutlineHome /></button>
        )
    }
    return (
        <>
            <div className='flex sm:items-center gap-2 md:gap-5 flex-col sm:flex-row text-xs md:text-sm'>
                {homeButton}
                <p className='tracking-wider'>Current User : {username}</p>
                <p className='tracking-wider'>Status : {status}</p>
            </div>
        </>
    )
}

export default DashFooter