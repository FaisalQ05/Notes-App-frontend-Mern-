import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAddUserMutation } from './usersApiSlice'
import { ROLES } from '../../config/roles'
import { AiOutlineSave } from 'react-icons/ai'
import { useEffect } from 'react'
import Toast from '../../components/Toast'
import useTitle from '../../hooks/useTitle'


const USER_REGEX = /^[A-z]{3,20}$/
const PWD_REGEX = /^[A-z0-9!@#$%]{5,12}$/

const NewUser = () => {
  useTitle("Add user")
  const [addNewUser, {
    isLoading, data, isSuccess, isError, error
  }] = useAddUserMutation()

  // console.log({ isError, error, isLoading, data })

  const navigate = useNavigate();

  const [user, setUser] = useState({
    username: '',
    password: '',
    roles: ['Employee']
  })
  const [validUsername, setValidUsername] = useState(false)
  const [validPassword, setValidPassword] = useState(false)

  useEffect(() => {
    // console.log("user useeffect")
    setValidUsername(USER_REGEX.test(user.username))
  }, [user.username])

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(user.password))
  }, [user.password])

  const onSaveUserClicked = async (e) => {
    e.preventDefault()
    if (canSave) {
      await addNewUser({ ...user })
    }
  }

  useEffect(() => {
    if (isSuccess) {
      setUser({
        username: '',
        password: '',
        roles: ['']
      })
      const userSaveSuccessData = { isSuccess, message: data.message }
      navigate('/dash/users', { state: userSaveSuccessData })
    }
  }, [isSuccess])

  const options = Object.values(ROLES).map(role => {
    return (
      <option className='text-xs sm:text-lg' key={role} value={role}>{role}</option>
    )
  })

  const onRolesChanged = (e) => {
    const values = Array.from(
      e.target.selectedOptions, //HTMLCollection 
      (option) => option.value
    )
    setUser((user) => ({ ...user, roles: values }))
  }
  // console.log(user)


  const inputEvent = (e) => {
    // console.log(e.target)
    const { name, value } = e.target;
    setUser((p) => {
      return {
        ...p,
        [name]: value
      }
    })
  }

  let ErrorMessage;
  if (isError) {
    if (error.status === 'FETCH_ERROR') {
      ErrorMessage = "Connection Failed"
    }
    else {
      ErrorMessage = error.data?.message
    }
  }

  const canSave = [user.roles.length, validUsername, validPassword].every(Boolean) && !isLoading

  const content = (
    <>
      {isError && <Toast isError={isError} message={ErrorMessage} />}
      <form className='flex flex-col gap-2 w-[100%] sm:w-3/4 lg:w-2/4  md:p-2' onSubmit={onSaveUserClicked}>
        <section className='flex justify-between items-center'>
          <h2 className='sm:text-2xl md:text-3xl text-gray-100'>New User</h2>
          <button disabled={!canSave} className={`hover:text-blue-500 transition-all duration-200 ${canSave ? '' : 'disabled:hover:text-gray-300 disabled:opacity-40 disabled:cursor-not-allowed'}`}><AiOutlineSave size={30} /></button>
        </section>
        <label className='text-xs sm:text-sm md:text-xl' htmlFor="username">Username : <span>[ 3-20 letters ]</span></label>
        <input className={`text-xs sm:text-sm md:text-xl text-black p-2 outline-none rounded-lg ${validUsername ? null : 'border-[0.2em] border-red-700'}`} onChange={inputEvent} name='username' value={user.username} type="text" />
        <label className='text-xs sm:text-sm md:text-xl' htmlFor="password">Password : <span>[ 5-12 chars incl. !@#$% ]</span></label>
        <input className={`text-xs sm:text-sm md:text-xl text-black p-2 outline-none rounded-lg ${validPassword ? null : 'border-[0.2em] border-red-700'}`} onChange={inputEvent} name='password' value={user.password} type="password" />
        <select className='text-black self-start text-xs sm:text-sm md:text-base' multiple
          onChange={onRolesChanged} size='3' value={user.roles}>
          {options}
        </select>
      </form>
    </>
  )

  return content
}

export default NewUser