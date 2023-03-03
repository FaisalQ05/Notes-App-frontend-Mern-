import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAddNoteMutation } from './notesApiSlice'
import { AiOutlineSave } from 'react-icons/ai'
import { useEffect } from 'react'
import Toast from '../../components/Toast'
import useAuth from '../../hooks/useAuth'

const NewNoteForm = ({ users }) => {
    // console.log(users)
    const { username, isAdmin, isManager } = useAuth()
    const [addNewNote, { isLoading, isSuccess, isError, error, data }] = useAddNoteMutation()

    const navigate = useNavigate();

    let allUsers;
    if (isAdmin || isManager) {
        allUsers = [...Object.values(users)]
    }
    else {
        allUsers = [...Object.values(users).filter(user => user.username === username)]
        // allUsers = [...Object.values(users)]
    }
    // console.log(allUsers)

    const [note, setNote] = useState({
        title: '',
        text: '',
        user: allUsers[0].id,
    })
    // console.log(note)

    const canSave = [note.title, note.text, note.user].every(Boolean) && !isLoading

    const options = allUsers.map(user => {
        return (
            <option className='text-xs sm:text-lg'
                key={user.id}
                value={user.id}
            >{user.username}</option>
        )
    })

    const inputEvent = (e) => {
        setNote((note) => ({ ...note, [e.target.name]: e.target.value }))
    }

    const onUserIdChange = (e) => {
        setNote((note) => ({ ...note, user: e.target.value }))
    }

    const onSaveNoteClicked = async (e) => {
        e.preventDefault()
        if (canSave) {
            await addNewNote(note)
        }
    }

    useEffect(() => {
        if (isSuccess) {
            setNote({
                title: '',
                text: '',
                user: ''
            })
            const notesSuccessData = { isSuccess, message: data.message }
            navigate('/dash/notes', { state: notesSuccessData })
        }
    }, [isSuccess])

    let errorMessage;
    if (isError) {
        errorMessage = error?.data?.message
    }
    // console.log(errorMessage)

    const content = (
        <>
            {isError && <Toast isError={isError} message={errorMessage} />}
            <form className='flex flex-col gap-2 w-[100%] sm:w-3/4 lg:w-2/4  md:p-2 h-[100%]' onSubmit={onSaveNoteClicked}>
                <section className='flex justify-between items-center'>
                    <h2 className='sm:text-2xl md:text-3xl text-gray-100'>New Note</h2>
                    <button disabled={!canSave} className={`hover:text-blue-500 transition-all duration-200 ${canSave ? '' : 'disabled:hover:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed'}`}><AiOutlineSave size={30} /></button>
                </section>
                <label className='text-sm md:text-xl' htmlFor="title">Title :</label>
                <input className='text-xs sm:text-sm md:text-xl text-black p-2 outline-none rounded-lg' onChange={inputEvent} name='title' value={note.title} type="text" />
                <label className='text-xs sm:text-sm md:text-xl' htmlFor="text">Text :</label>
                <textarea className='text-xs sm:text-sm md:text-xl text-black p-2 outline-none rounded-lg h-[30%]' onChange={inputEvent} name='text' value={note.text} />
                {(isAdmin || isManager) && (<>
                    <label className='text-xs sm:text-sm md:text-xl' htmlFor="">ASSIGNED TO:</label>
                    <select className='text-black self-start text-xs sm:text-sm md:text-base'
                        onChange={onUserIdChange} value={note.user}>
                        {options}
                    </select></>)}
            </form>
        </>
    )

    return content
}

export default NewNoteForm