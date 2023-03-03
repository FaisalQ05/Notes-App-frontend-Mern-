import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetNotesQuery } from './notesApiSlice'
import { AiOutlineEdit } from 'react-icons/ai'

const Note = ({ noteId }) => {
    // console.log(noteId)
    const { note } = useGetNotesQuery("notesList", {
        selectFromResult: ({ data }) => ({
            note: data?.entities[noteId]
        })
    })
    // console.log({ note })
    const navigate = useNavigate();
    if (note) {
        const created = new Date(note.createdAt).toLocaleString('en-us', {
            day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric'
        })
        // console.log(created)
        const updated = new Date(note.updatedAt).toLocaleString('en-us', {
            day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric'
        })
        // console.log(updated)

        return (
            <>
                <tr className='text-center text-xs sm:text-base md:text-xl border-b'>
                    <td className='p-2'>{note.completed ? <span className='text-green-500'>Completed</span> : <span className='text-red-500'>Open</span>}</td>
                    <td className='p-2 hidden md:table-cell'>{created}</td>
                    <td className='p-2 hidden md:table-cell'>{updated}</td>
                    <td className='p-2'>{note.title}</td>
                    <td className='p-2 hidden md:table-cell'>{note.user.username}</td>
                    <td className='p-2 flex justify-center items-center hover:cursor-pointer hover:text-blue-500 transition-all duration-200'>
                        <button onClick={() => navigate(`/dash/notes/${noteId}`)}><AiOutlineEdit size={25} /></button>
                    </td>
                </tr>
            </>
        )
    }
    else return null

}

export default Note