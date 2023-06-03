import React from "react"
import { selectCurrentToken } from "./authSlice"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const IsUserLoggedIn = ({ redirect = "/dash", children }) => {
  const token = useSelector(selectCurrentToken)

  // console.log("Is use log in ",token)
  // if (token) {
  //   // console.log("Condition one")
  //   return <Navigate to={redirect} replace />
  // }
  // if (children) {
  //   // console.log("Condition two")
  //   return <Navigate to={"login"} replace />
  // } else {
  //   // console.log("Condition three")
  //   return <Outlet />
  // }
  // return children ? children : <Outlet />
  //If we want to replace url login for all other routes
  //we have to use Naviagte replace if not then children
  return children ? <Navigate to={"login"} replace /> : <Outlet />
  // return <Navigate to={'login'} replace />
}

export default IsUserLoggedIn
