import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetUsersQuery } from './usersApiSlice'
import { AiOutlineEdit } from 'react-icons/ai'


const User = ({ userId }) => {
    // console.log(userId)
    const navigate = useNavigate()
    const { user } = useGetUsersQuery("usersList", {
        selectFromResult: ({ data }) => ({
            user: data?.entities[userId]
        })
    })
    // console.log(user)
    if (user) {
        const handleEdit = (e) => {
            navigate(`/dash/users/${userId}`)
        }
        const userRoleString = user.roles.toString().replaceAll(',', '  |  ')
        return (
            <>
                <tr className={`text-center text-xs sm:text-base md:text-xl border-b ${user.active ? '' : 'opacity-70 text-red-300'}`}>
                    <td className='p-2'>{user.username}</td>
                    <td className='p-2'>{userRoleString}</td>
                    <td className='p-2 flex justify-center items-center'>
                        <button onClick={handleEdit} className='hover:text-blue-400 transition-all duration-200'><AiOutlineEdit size={25} /></button>
                    </td>
                </tr>
            </>
        )
    } else return null
}

export default User