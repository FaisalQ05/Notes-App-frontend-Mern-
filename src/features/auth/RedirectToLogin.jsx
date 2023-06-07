import React from "react"
import { Outlet, Navigate } from "react-router-dom"

const RedirectToLogin = ({ children }) => {
  if (children) {
    console.log("Condition two")
    return <Navigate to={"login"} replace />
  } else {
    console.log("Condition three")
    return <Outlet />
  }
}

export default RedirectToLogin
