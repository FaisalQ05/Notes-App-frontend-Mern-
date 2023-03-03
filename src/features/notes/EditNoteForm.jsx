import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDeleteNoteMutation, useUpdateNoteMutation } from './notesApiSlice'
import { AiOutlineSave, AiOutlineDelete } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import Toast from '../../components/Toast'
import useAuth from '../../hooks/useAuth'

const EditNoteForm = ({ users, note }) => {
    const navigate = useNavigate();
    const { isAdmin, isManager } = useAuth()

    let allUsers = [...Object.values(users)]
    // console.log(allUsers)

    const [noteDetails, setNote] = useState({
        title: note.title,
        text: note.text,
        user: note.user._id,
        completed: note.completed
    })

    // console.log(noteDetails)

    const created = new Date(note.createdAt).toLocaleString('en-us', {
        day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric'
    })
    const updated = new Date(note.updatedAt).toLocaleString('en-us', {
        day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric'
    })

    const [updateNote, { data, isLoading, isSuccess, isError, error }] = useUpdateNoteMutation()

    const [deleteNote, { data: delData, isSuccess: isDeleteSuccess,
        isError: isDelError, error: delError }] = useDeleteNoteMutation()



    // console.log({ data, error, isSuccess })

    const handleDeleteUser = async () => {
        // console.log("delete user called")
        await deleteNote({ id: note.id })
    }

    let deleteButton = null
    if (isAdmin || isManager) {
        deleteButton = (<button onClick={handleDeleteUser} className='hover:text-red-500 transition-all duration-200'><AiOutlineDelete size={30} /></button>)
    }

    const canSave = [noteDetails.title, noteDetails.text, noteDetails.user].every(Boolean) && !isLoading

    const inputEvent = (e) => {
        setNote((note) => ({ ...note, [e.target.name]: e.target.value }))
    }
    const onUserIdChange = (e) => {
        setNote((note) => ({ ...note, user: e.target.value }))
    }

    const options = allUsers.map(user => {
        return (
            <option className='text-xs sm:text-lg' key={user.id} value={user.id}>{user.username}</option>
        )
    })

    const onNoteCompleteChange = () => {
        setNote(note => ({ ...note, completed: !note.completed }))
    }

    const handleSaveUser = async () => {
        // console.log("save user called")
        if (canSave) {
            await updateNote({ id: note.id, ...noteDetails })
        }
    }

    useEffect(() => {
        if (isSuccess || isDeleteSuccess) {
            setNote({
                title: '',
                text: '',
                user: '',
                completed: false
            })
            let successData;
            if (isSuccess) {
                successData = {
                    isSuccess,
                    message: data?.message
                }
            }
            if (isDeleteSuccess) {
                successData = {
                    isSuccess: true,
                    message: delData?.message
                }
            }
            navigate('/dash/notes', { state: successData })
        }
    }, [isSuccess, isDeleteSuccess])

    let errorMessage;
    if (isError) {
        if (error?.status === 'FETCH_ERROR') {
            errorMessage = "Connection Failed"
        }
        else {
            errorMessage = error?.data?.message
        }

    }

    const content = (
        <>
            {isError && <Toast isError={isError} message={errorMessage} />}
            <form className='flex h-[100%] flex-col gap-2 w-[100%] sm:w-3/4 lg:w-2/4  md:p-2' onSubmit={(e) => e.preventDefault()}>
                <section className='flex justify-between items-center'>
                    <h2 className='sm:text-2xl md:text-3xl text-gray-100'>New Note</h2>
                    <section className='flex items-center'>
                        <button onClick={handleSaveUser} disabled={!canSave} className={`hover:text-blue-500 transition-all duration-200 ${canSave ? '' : 'disabled:hover:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed'}`}><AiOutlineSave size={30} /></button>
                        {deleteButton}
                    </section>
                </section>
                <label className='text-sm md:text-xl' htmlFor="title">Title :</label>
                <input className='text-xs sm:text-sm md:text-xl text-black p-2 outline-none rounded-lg' onChange={inputEvent} name='title' value={noteDetails.title} type="text" />
                <label className='text-sm md:text-xl' htmlFor="text">Text :</label>
                <textarea className='text-xs sm:text-sm md:text-xl text-black p-2 outline-none rounded-lg h-[30%]' onChange={inputEvent} name='text' value={noteDetails.text} />
                <section className='flex sm:justify-between flex-col sm:flex-row gap-2 sm:gap-0'>
                    <section className='basis-[50%] flex flex-col gap-0 sm:gap-2'>

                        <section className='flex items-center gap-2'>
                            <label className='text-xs md:text-xl' htmlFor="">Completed : </label>
                            <input className='border w-5 h-4' type='checkbox' checked={noteDetails.completed} onChange={onNoteCompleteChange} />
                        </section>
                        {(isAdmin || isManager) && (<>
                            <section className='flex gap-2 items-center'>
                                <label className='text-xs sm:text-sm md:text-xl' htmlFor="">ASSIGNED TO:</label>
                                <select className='text-black self-start text-xs sm:text-sm md:text-xl'
                                    onChange={onUserIdChange} value={noteDetails.user}>
                                    {options}
                                </select>
                            </section></>)}
                    </section>

                    <section className='basis-[50%] flex flex-col sm:items-end text-xs md:text-base'>
                        <p>Created : <span>{created}</span></p>
                        <p>Updated : <span>{updated}</span></p>
                    </section>
                </section>
            </form>
        </>
    )
    return content
}

export default EditNoteForm