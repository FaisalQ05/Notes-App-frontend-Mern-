import React from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../../components/Loading'
import useTitle from '../../hooks/useTitle'
import EditUserForm from './EditUserForm'
import { useGetUsersQuery } from './usersApiSlice'

const EditUser = () => {
  useTitle("Edit user")
  const { id } = useParams()
  // console.log(id)
  const { user, isLoading, isSuccess } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data, isLoading, isSuccess }) => ({
      user: data?.entities[id],
      isLoading,
      isSuccess
    })
  })

  // console.log({ user, isLoading, isSuccess })

  let content;
  if (isLoading) {
    content = <Loading/>
  }
  if (isSuccess) {
    content = user ? <EditUserForm userData={user} /> : <p>No User found</p>
  }
  if (!isSuccess) {
    content = <p>Not Available</p>
  }

  return content
}

export default EditUser