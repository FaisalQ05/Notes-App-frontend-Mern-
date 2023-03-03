import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Loading from '../../components/Loading'
import Toast from '../../components/Toast'
import useAuth from '../../hooks/useAuth'
import useTitle from '../../hooks/useTitle'
import Note from './Note'
import { useGetNotesQuery } from './notesApiSlice'

const NotesList = () => {
    useTitle("Notes List")
    const { data, isLoading, isSuccess, isError, error } = useGetNotesQuery("notesList", {
        pollingInterval: '15000',
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    const { isAdmin, isManager, username } = useAuth()

    // console.log({ data, isLoading, isSuccess, isError, error })

    let content;
    if (isLoading) {
        content = <Loading/>
    }

    if (isError) {
        let errorMessage;
        if (error.status === 'FETCH_ERROR') {
            errorMessage = "Server Error"
        }
        else {
            errorMessage = error?.data?.message
        }
        content = error.status === 401 ? <Link className='text-lg text-blue-400 border-b-2 border-blue-500' to='/login'>{errorMessage}</Link> : <p>{errorMessage}</p>
    }


    const { state } = useLocation()
    // console.log(state)
    window.history.replaceState({}, document.title)

    if (isSuccess) {

        const { ids, entities } = data
        let filterIds;
        if (isAdmin || isManager) {
            filterIds = [...ids]
        }
        else {
            filterIds = ids.filter(noteId => entities[noteId].user.username == username)
        }
        const tableContent = filterIds.map(noteId => <Note key={noteId} noteId={noteId} />)
        content = (
            <section className=''>
                {state?.isSuccess && <Toast isSuccess={state.isSuccess} message={state.message} />}
                <table className='w-full bg-gray-600'>
                    <thead>
                        <tr className='bg-gray-700 text-sm sm:text-base md:text-2xl'>
                            <th className='py-1'>Status</th>
                            <th className='hidden md:table-cell py-1'>Created</th>
                            <th className='hidden md:table-cell py-1'>Updated</th>
                            <th className='py-1'>Title</th>
                            <th className='hidden md:table-cell py-1'>Owner</th>
                            <th className='py-1'>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableContent}
                    </tbody>
                </table>
            </section>
        )
    }

    return content
}

export default NotesList