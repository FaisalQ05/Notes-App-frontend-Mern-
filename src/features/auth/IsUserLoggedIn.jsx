import React from "react"
import { selectCurrentToken } from "./authSlice"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const IsUserLoggedIn = ({ redirect = "/dash", children }) => {
  const token = useSelector(selectCurrentToken)
  if (token) {
    return <Navigate to={redirect} replace />
  }
  return children ? <Navigate to={'login'} replace /> : <Outlet/>
  // return <Navigate to={'login'} replace />
}

export default IsUserLoggedIn
