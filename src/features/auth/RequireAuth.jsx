import React from "react"
import { Link, Outlet, useOutletContext } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const RequireAuth = ({ allowedRoles }) => {
  const { roles } = useAuth()
  let content
  if (roles.some((role) => allowedRoles.includes(role))) {
    content = <Outlet />
  } else {
    content = (
      <div className="bg-gray-900 text-white p-3 text-base  md:text-2xl">
        <h3>
          You are not allowed to access this{" "}
          <Link to="/dash" className="text-blue-300 hover:text-gray-400">
            Go back to Dashboard
          </Link>
        </h3>
      </div>
    )
  }

  return content
}

export default RequireAuth
