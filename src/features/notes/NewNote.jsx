import React from 'react'
import Loading from '../../components/Loading';
import useTitle from '../../hooks/useTitle';
import { useGetUsersQuery } from '../users/usersApiSlice'
import NewNoteForm from './NewNoteForm';

const NewNote = () => {
    useTitle("Add note")
    const { users, isLoading, isSuccess, isError } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data, isLoading, isSuccess, isError }) => ({
            users: data?.entities,
            isLoading,
            isSuccess,
            isError
        })
    })

    let content;
    if (isLoading) content = <Loading/>
    if (isError) content = <p>Not Currently available</p>
    if (isSuccess) {
        content = <NewNoteForm users={users} />
    }
    return content
}

export default NewNote