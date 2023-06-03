import React from "react"
import { Navigate, Outlet, useOutletContext } from "react-router-dom"
import usePersist from "../../hooks/usePersist"
import { useSelector } from "react-redux"
import { selectCurrentToken } from "./authSlice"

const ProtectDashboadRoutes = ({ redirect = "/login", children }) => {
  // const token = useSelector(selectCurrentToken)
  const context = useOutletContext()
  const token = useSelector(selectCurrentToken)
  const [persist] = usePersist()
  console.log("ProtectRouteNonPersist")
  if (persist && context?.status === 401 && !token) {
    console.log("Condition one")
    return <Navigate to={redirect} replace />
  }
  if (!persist && !token) {
    console.log("Condition two")
    return <Navigate to={redirect} replace />
  }

  //   console.log("outlet ",children)
  //   console.log("outlet ",Outlet)
  return <Outlet />
}

export default ProtectDashboadRoutes
