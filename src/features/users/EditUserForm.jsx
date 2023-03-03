import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeleteUserMutation, useUpdateUserMutation } from './usersApiSlice'
import { AiOutlineSave, AiOutlineDelete } from 'react-icons/ai'
import { ROLES } from '../../config/roles'
import Toast from '../../components/Toast'

const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{5,12}$/

const EditUserForm = ({ userData }) => {
    // console.log(userData)

    const navigate = useNavigate();

    const [updateUser, {
        isLoading,
        isSuccess,
        isError,
        error,
        data, status }] = useUpdateUserMutation()

    const [deleteUser, { data: delData, isSuccess: isDeleteSuccess, isError: isDeleteError, error: delError }] = useDeleteUserMutation()

    // console.log({ data, isLoading, isSuccess, isError, error, status })
    // console.log({ delData, delError, isDeleteError, isDeleteSuccess })

    const [user, setUser] = useState({
        username: userData.username,
        password: '',
        active: userData.active,
        roles: userData.roles
    })
    const [validUsername, setValidUsername] = useState(false)
    const [validPassword, setValidPassword] = useState(false)

    const inputEvent = (e) => {
        const { name, value } = e.target;
        setUser((user) => ({ ...user, [name]: value }))
    }

    useEffect(() => {
        setValidUsername(USER_REGEX.test(user.username))
    }, [user.username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(user.password))
    }, [user.password])

    let canSave
    if (user.password) {
        canSave = [user.roles.length, validUsername, validPassword].every(Boolean) && !isLoading
    } else {
        canSave = [user.roles.length, validUsername].every(Boolean) && !isLoading
    }

    const options = Object.values(ROLES).map(role => {
        return (
            <option className='text-xs sm:text-lg' key={role} value={role}>{role}</option>
        )
    })

    const onActiveChanged = () => {
        setUser((user) => ({ ...user, active: !user.active }))
    }

    const onRolesChanged = (e) => {
        const values = Array.from(
            e.target.selectedOptions, //HTMLCollection 
            (option) => option.value
        )
        setUser((user) => ({ ...user, roles: values }))
    }

    const onUpdateUserClicked = async () => {
        if (user.password) {
            await updateUser({ id: userData.id, ...user })
        }
        else {
            await updateUser({ id: userData.id, username: user.username, active: user.active, roles: user.roles })
        }
    }

    useEffect(() => {
        if (isSuccess || isDeleteSuccess) {
            setUser({
                username: '',
                password: '',
                active: false,
                roles: ['']
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
                    isSuccess: isDeleteSuccess,
                    message: delData?.message,
                }
            }
            navigate('/dash/users', { state: successData })
        }
    }, [isSuccess, isDeleteSuccess])

    const onDeleteUserClicked = async () => {
        await deleteUser({ id: userData.id })
    }

    let ErrorMessage;
    let editUserErrorMessage;
    if (isError || isDeleteError) {
        if (error?.status === 'FETCH_ERROR') {
            ErrorMessage = "Connection Failed"
        }
        if (delError) {
            // console.log("delete error")
            ErrorMessage = delError?.data?.message
        }
        if (isError) {
            // console.log("update error")
            editUserErrorMessage = error?.data?.message
        }
    }

    // console.log({ErrorMessage})


    const content = (
        <>
            {isError && <Toast isError={isError} message={editUserErrorMessage} edit={true} />}
            {isDeleteError && <Toast isError={isDeleteError} message={ErrorMessage} />}
            <form className='flex flex-col gap-2 w-[100%] sm:w-3/4 lg:w-2/4  md:p-2' onSubmit={e => e.preventDefault()}>
                <section className='flex justify-between items-center'>
                    <h2 className='sm:text-2xl md:text-3xl text-gray-100'>Edit User</h2>
                    <section>
                        <button onClick={onUpdateUserClicked} disabled={!canSave} className={`hover:text-blue-500 transition-all duration-200 ${canSave ? '' : 'disabled:hover:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed'}`}><AiOutlineSave size={30} /></button>
                        <button onClick={onDeleteUserClicked} className='hover:text-red-500 transition-all duration-200`'><AiOutlineDelete size={30} /></button>
                    </section>
                </section>
                <label className='text-xs sm:text-sm md:text-xl' htmlFor="username">Username : <span>[ 3-20 letters ]</span></label>
                <input className={`text-xs sm:text-sm md:text-xl text-black p-2 outline-none rounded-lg ${!validUsername ? 'border-[0.2em] border-red-700' : null}`} onChange={inputEvent} name='username' value={user.username} type="text" />
                <label className='text-xs sm:text-sm md:text-xl' htmlFor="password">Password : <span>[ 5-12 chars incl. !@#$% ]</span></label>
                <span className='text-xs sm:text-sm md:text-xl'>[ Empty = No change ]</span>
                <input className={`text-xs sm:text-sm md:text-xl text-black p-2 outline-none rounded-lg ${user.password && !validPassword ? 'border-[0.2em] border-red-700' : null}`} onChange={inputEvent} name='password' value={user.password} type="password" />
                <section className='flex gap-2 text-xs sm:text-sm md:text-xl'>
                    <label htmlFor="active">Active</label>
                    <input className='sm:w-4' type="checkbox" checked={user.active} onChange={onActiveChanged} />
                </section>
                <label className='text-xs sm:text-sm md:text-xl' htmlFor="Roles">Assigned Roles :</label>
                <select className='text-black self-start text-xs sm:text-sm md:text-base' multiple
                    onChange={onRolesChanged} size='3' value={user.roles}>
                    {options}
                </select>
            </form>
        </>
    )
    return content;
}

export default EditUserForm