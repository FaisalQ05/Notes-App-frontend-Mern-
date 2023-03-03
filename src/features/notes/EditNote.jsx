import React from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../../components/Loading'
import useTitle from '../../hooks/useTitle'
import { useGetUsersQuery } from '../users/usersApiSlice'
import EditNoteForm from './EditNoteForm'
import { useGetNotesQuery } from './notesApiSlice'

const EditNote = () => {
  useTitle("Edit note")
  const { id } = useParams()
  // console.log(id)
  const { note, isLoading: isLoadingNote, isSuccess: isSuccessNote } = useGetNotesQuery("notesList", {
    selectFromResult: ({ data, isLoading, isSuccess }) => ({
      note: data?.entities[id],
      isLoading, isSuccess
    })
  })
  // console.log({ note, isLoadingNote, isSuccessNote })

  const { users, isLoading, isSuccess, isError } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data, isLoading, isSuccess, isError }) => ({
      users: data?.entities,
      isLoading,
      isSuccess,
      isError
    })
  })

  let content;
  if (isLoading || isLoadingNote) content = <Loading/>
  if (isError) content = <p>Not currently available</p>

  if (isSuccess && isSuccessNote) {
    content = note ? <EditNoteForm note={note} users={users} /> : <p>No note found</p>
  }
  return content
}

export default EditNote