import React, { useRef } from "react"
import { useState } from "react"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Link, Outlet } from "react-router-dom"
import Loading from "../../components/Loading"
import usePersist from "../../hooks/usePersist"
import { useRefreshMutation } from "./authApiSlice"
import { selectCurrentToken } from "./authSlice"

const PersistLogin = () => {
  const [persist] = usePersist()
  const token = useSelector(selectCurrentToken)
  const [istrueSuccess, setTrueSuccess] = useState(false)
  const effectRan = useRef(false)

  const [refresh, { isLoading, isSuccess, isError, error, isUninitialized }] =
    useRefreshMutation()

  useEffect(() => {
    if (process.env.NODE_ENV !== "development" || effectRan.current == true) {
      const verifyRefreshToken = async () => {
        try {
          await refresh()
          setTrueSuccess(true)
        } catch (e) {
          console.log("Refresh error : ", e)
        }
      }

      if (!token && persist) {
        verifyRefreshToken()
      }
    }

    return () => {
      effectRan.current = true
    }
  }, [])

  console.log("persist")

  let content
  if (!persist) {
    console.log("not persist")
    content = <Outlet />
  } else if (isLoading) {
    // console.log("refresh loading")
    content = (
      <div className="bg-gray-900 text-xl text-white p-4 h-screen">
        <Loading />
      </div>
    )
  } else if (isError) {
    console.log("is", error)
    let errorMessage
    // errorMessage = error?.status === 401 ? 'Back to Login' : error?.data?.message
    // console.log("refresh error")
    // content = <div className='bg-gray-900 h-screen w-full text-white p-3 text-base  md:text-2xl'>{error.status === 'FETCH_ERROR' ? errorMessage : <Link to='/login' className='text-blue-300 hover:text-gray-400'>{errorMessage}</Link>}</div>
    content = <Outlet context={error} />
  } else if (isSuccess && istrueSuccess) {
    console.log("refresh success")
    content = <Outlet context={null} />
  } else if (token && isUninitialized) {
    console.log("have token and query isUninitialized")
    content = <Outlet />
  }
  return content
}

export default PersistLogin
