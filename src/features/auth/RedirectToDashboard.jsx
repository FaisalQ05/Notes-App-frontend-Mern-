import React from "react"
import { useSelector } from "react-redux"
import { selectCurrentToken } from "./authSlice"
import { Navigate, Outlet } from "react-router-dom"

const RedirectToDashboard = ({ redirect = "/dash" }) => {
  const token = useSelector(selectCurrentToken)

  console.log("Is use log in Component Token :  ", token)
  if (token) {
    console.log("Condition one if user have token redirect to dashboard")
    return <Navigate to={redirect} replace />
  } else {
    return <Outlet />
  }
}

export default RedirectToDashboard
