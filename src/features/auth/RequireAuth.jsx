import React from 'react'
import { useSelector } from 'react-redux'
import { Link, Outlet } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import usePersist from '../../hooks/usePersist'
import { selectCurrentToken } from './authSlice'

const RequireAuth = ({ allowedRoles }) => {
    const { roles, username } = useAuth()
    const token = useSelector(selectCurrentToken
    )

    const [persist] = usePersist()
    const tokenAndPersistFalse = !token && !persist
    // console.log(allowedRoles)
    const content = (
        roles.some(role => allowedRoles.includes(role)) ? <Outlet /> : tokenAndPersistFalse ? <div className='bg-gray-900 h-screen w-full text-white p-3 text-base  md:text-2xl'><Link to='/login' className='text-blue-300 hover:text-gray-400'>Back to Login</Link></div> : (<div className='bg-gray-900 text-white p-3 text-base  md:text-2xl'><h3>You are not allowed to access this <Link to='/dash' className='text-blue-300 hover:text-gray-400'>Go back to Dashboard</Link></h3></div>)
    )
    return content
}

export default RequireAuth