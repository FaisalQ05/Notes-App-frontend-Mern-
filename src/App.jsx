import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import DashLayout from "./components/DashLayout"
import Layout from "./components/Layout"
import Public from "./components/Public"
import { ROLES } from "./config/roles"
import Login from "./features/auth/Login"
import PersistLogin from "./features/auth/PersistLogin"
import RequireAuth from "./features/auth/RequireAuth"
import Welcome from "./features/auth/Welcome"
import EditNote from "./features/notes/EditNote"
import NewNote from "./features/notes/NewNote"
import NotesList from "./features/notes/NotesList"
import EditUser from "./features/users/EditUser"
import NewUser from "./features/users/NewUser"
import UsersList from "./features/users/UsersList"
import useTitle from "./hooks/useTitle"
import IsUserLoggedIn from "./features/auth/IsUserLoggedIn"
import ProtectDashboadRoutes from "./features/auth/ProtectDashboadRoutes"
import { selectCurrentToken } from "./features/auth/authSlice"
import { useSelector } from "react-redux"
import RedirectToLogin from "./features/auth/RedirectToLogin"
import RedirectToDashboard from "./features/auth/RedirectToDashboard"

const RedirectLoggedInUser = () => {
  const token = useSelector(selectCurrentToken)

  return token ? <Navigate to="/dash" /> : null
}

const App = () => {
  useTitle("Notes App")
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        {/* <Route path="*" element={<Login />} /> */}
        {/* <Route path="/" element={<Login />} /> */}
        <Route element={<PersistLogin />}>
          <Route element={<RedirectToDashboard />}>
            <Route element={<RedirectToLogin />}>
              <Route
                path="*"
                element={
                  <RedirectToLogin>
                    <Login />
                  </RedirectToLogin>
                }
              />
              <Route path="login" element={<Login />} />
            </Route>
          </Route>

          <Route element={<ProtectDashboadRoutes />}>
            <Route
              element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
            >
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<Welcome />} />

                <Route path="notes">
                  <Route index element={<NotesList />} />
                  <Route path=":id" element={<EditNote />} />
                  <Route path="new" element={<NewNote />} />
                </Route>

                <Route
                  element={
                    <RequireAuth allowedRoles={[ROLES.Admin, ROLES.Manager]} />
                  }
                >
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUser />} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
