import React from 'react'
import { useGetUsersQuery } from './usersApiSlice'
import User from './User'
import { Link, useLocation } from 'react-router-dom'
import Toast from '../../components/Toast'
import Loading from '../../components/Loading'
import useTitle from '../../hooks/useTitle'

const UsersList = () => {
  useTitle("Users List")
  const { data, isLoading, isSuccess, isError, error } = useGetUsersQuery("usersList", {
    pollingInterval: '60000',
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true
  })
  // console.log({ data, isLoading, isSuccess, isError, error })

  let content;

  if (isLoading) content = <Loading />

  if (isError) {
    let errorMessage;
    if (error.status === 'FETCH_ERROR') {
      errorMessage = "Server Error"
    }
    else {
      errorMessage = error?.data?.message
    }
    // content = <p>{errorMessage}</p>
    content = error.status === 401 ? <Link className='text-lg text-blue-400 border-b-2 border-blue-500' to='/login'>{errorMessage}</Link> : <p>{errorMessage}</p>
  }

  const { state } = useLocation()
  // console.log("State : ", state)
  window.history.replaceState({}, document.title)

  if (isSuccess) {
    const { ids } = data
    // console.log(ids)
    const tabelContent = ids?.length ? ids.map(userId => <User key={userId} userId={userId} />) : null
    content = (
      <section className=''>
        {state?.isSuccess && <Toast isSuccess={state.isSuccess} message={state.message} />}
        <table className='w-full bg-gray-600'>
          <thead>
            <tr className='bg-gray-700 text-sm sm:text-base md:text-2xl'>
              <th className='py-1'>Username</th>
              <th className='py-1'>Role</th>
              <th className='py-1'>Edit</th>
            </tr>
          </thead>
          <tbody>
            {tabelContent}
          </tbody>
        </table>
      </section>
    )
  }

  return content
}

export default UsersList