import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { selectCurrentToken } from './authSlice'

const Welcome = () => {

    const token = useSelector(selectCurrentToken)
    const { username, isAdmin, isManager } = useAuth()
    const date = new Date()
    const today = new Intl.DateTimeFormat('en', { dateStyle: 'full', timeStyle: 'full' }).format(date)
    return (
        <>
            <div className='flex flex-col gap-3 md:gap-5'>
                <p className='text-sm md:text-xl text-gray-400'>{today}</p>
                <h1 className='sm:text-3xl text-2xl'>Welcome {username}</h1>
                {/* link section */}
                <div className='flex flex-col text-sm md:text-xl gap-3 tracking-wide mt-3 items-start'>
                    <Link className='border-b hover:text-blue-500 transition-all duration-200' to='/dash/notes'>View Notes</Link>
                    <Link className='border-b hover:text-blue-500 transition-all duration-200' to='/dash/notes/new'>Add New Note</Link>
                    {(isAdmin || isManager) && <Link className='border-b hover:text-blue-500 transition-all duration-200' to='/dash/users'>View Users</Link>}
                    {(isAdmin || isManager) && <Link className='border-b hover:text-blue-500 transition-all duration-200' to='/dash/users/new'>Add New User</Link>}
                </div>
            </div>
        </>
    )
}

export default Welcome