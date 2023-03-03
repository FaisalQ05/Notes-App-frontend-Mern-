import React from 'react'
import { useEffect } from 'react'
import { FiLogOut } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
import useTitle from '../hooks/useTitle'
import Loading from './Loading'

const DashHeader = () => {
    
    const navigate = useNavigate()
    const [sendLogout, { isLoading, isSuccess, isError, error }] = useSendLogoutMutation()

    const onLogoutClick = async (e) => {
        e.preventDefault()
        await sendLogout()
    }

    const homeButtonClick = () => {
        navigate('/dash')
    }

    useEffect(() => {
        if (isSuccess) {
            navigate('/')
        }
    }, [isSuccess])
    return (
        <div className='w-full'>
            <div className='p-1 flex justify-between w-full items-center'>
                <h1 className='text-3xl sm:text-5xl px-2 md:px-5 cursor-pointer hover:text-gray-500' onClick={homeButtonClick}>Notes App</h1>
                <button className='hover:text-blue-500 transition-all duration-200' onClick={onLogoutClick}><FiLogOut size={30} /></button>
            </div>
            <div className={`px-2 md:px-5 ${isLoading ? '' : 'hidden'}`}>{isLoading ? <Loading/> : ''}</div>
            <p className={`px-2 md:px-5 ${isError ? '' : 'hidden'}`}>{isError ? error?.data?.message : ''}</p>
        </div>
    )
}

export default DashHeader