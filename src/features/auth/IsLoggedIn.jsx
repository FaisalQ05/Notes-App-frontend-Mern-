import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Loading from '../../components/Loading';
import { useRefreshMutation } from './authApiSlice';
import { selectCurrentToken } from './authSlice';

const IsLoggedIn = () => {
    const token = useSelector(selectCurrentToken)
    console.log("IsLoggedIn: ", token)

    const [refresh, { isLoading, isSuccess, isError, error, isUninitialized }] = useRefreshMutation()

    console.log({ isLoading, isSuccess, isError, error, isUninitialized })
    useEffect(() => {
        if (process.env.NODE_ENV !== "development" || process.env.NODE_ENV === "development") {
            const verifyRefreshToken = async () => {
                console.log("refresh")
                try {
                    await refresh()
                }
                catch (e) {
                    console.log("Refresh error : ", e)
                }
            }

            if (!token) {
                verifyRefreshToken()
            }
        }


    }, [])
    let content;
    if (isLoading) {
        content = <div className='bg-gray-900 text-xl text-white p-4 h-screen'><Loading /></div>
    }
    if (isSuccess) {
        content = <Outlet />;
    }

    return content
}

export default IsLoggedIn