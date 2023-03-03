import React from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Loading from '../../components/Loading'
import usePersist from '../../hooks/usePersist'
import useTitle from '../../hooks/useTitle'
import { useSendLoginMutation } from './authApiSlice'
import { setCredentials } from './authSlice'

const Login = () => {
    useTitle("Login")
    const [user, setUser] = useState({
        username: '',
        password: ''
    })

    const userRef = useRef()
    const errRef = useRef()
    const [errMsg, setErrorMsg] = useState('')
    const [persist, setPersist] = usePersist()
    // console.log(persist)

    const navigate = useNavigate();
    const dispatch = useDispatch()

    const [login, { isLoading, isSuccess, data, isError, error }] = useSendLoginMutation()
    // console.log({ isLoading, isSuccess, data, isError, error })

    const InputEvent = (e) => {
        setUser(user => ({ ...user, [e.target.name]: e.target.value }))
    }

    const onToggleCheck = () => setPersist(prev => !prev)

    const handleSumbit = async (e) => {
        e.preventDefault();
        try {
            const { accessToken } = await login({ ...user }).unwrap()
            dispatch(setCredentials({ accessToken }))
            setUser({
                username: '',
                password: ''
            })
            navigate('/dash')
        }
        catch (error) {
            if (!error.status) {
                setErrorMsg('No server Response')
            }
            else if (error.status === 'FETCH_ERROR') {
                setErrorMsg('Server not responding')
            }
            else {
                setErrorMsg(error.data?.message)
            }
            errRef.current.focus()
        }
    }

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrorMsg('')
    }, [user.username, user.password])


    // if (isLoading) return <p>...... Loading</p>

    const content = (
        <section className='w-full h-screen bg-gray-900 flex flex-col text-gray-300'>
            {/* header */}
            <header className='basis-[15%] flex items-center'>
                <h1 className='text-3xl sm:text-5xl px-2 md:px-5'>Notes App</h1>
            </header>
            {/* Main content */}
            <main className='basis-[75%] p-3 sm:p-4 border-y-2'>
                <form className='flex flex-col gap-4 items-start' onSubmit={handleSumbit}>
                    <input ref={userRef} value={user.username} name='username' onChange={InputEvent} className='tracking-wide md:p-3 p-2 rounded-md outline-none text-base md:text-2xl sm:text-xl bg-slate-600 sm:w-3/4 md:w-1/2 w-[100%]' type="text" required />
                    <input value={user.password} name='password' onChange={InputEvent} className='md:p-3 p-2 rounded-md outline-none text-base md:text-2xl sm:text-xl bg-slate-600 sm:w-3/4 md:w-1/2 w-[100%]' type="password" required />
                    <button className='px-4 py-1 border text-base sm:text-xl rounded-lg hover:bg-slate-600 hover:border-0'>Login</button>
                    <section id='persist' className='flex gap-2'>
                        <input className='w-4  border-4 border-red-400' type="checkbox" checked={persist} onChange={onToggleCheck} />
                        <label htmlFor="">
                            Trust This Device</label>
                    </section>
                    {isLoading && <Loading />}
                    <p className={`text-red-500 ${errMsg ? '' : 'hidden'}`} ref={errRef}>{errMsg}</p>
                </form>
            </main>
            {/* login link */}
            <footer className='basis-[10%] p-4'>
                <Link to='/' className='text-xl sm:text-3xl transition-all duration-300 hover:text-blue-600'>Back to Home</Link>
            </footer>
        </section>
    )

    return content
}

export default Login