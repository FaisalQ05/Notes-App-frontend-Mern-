import React from 'react'
import { Link } from 'react-router-dom'
import useTitle from '../hooks/useTitle'

const Public = () => {
    useTitle("Notes App")
    return (
        <section className='w-full h-screen bg-gray-900 text-gray-300 flex flex-col'>
            {/* header */}
            <header className='basis-[15%] flex items-center'>
                <h1 className='text-3xl sm:text-5xl px-2 md:px-5'>Notes App</h1>
            </header>
            {/* Main content */}
            <main className='basis-[75%] p-3 sm:p-4 border-y-2 text-gray-400'>
                <h3 className='text-xl sm:text-3xl'>Public Page</h3>
                <p className='text-sm sm:text-base mt-5'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores soluta adipisci saepe quasi nobis provident similique corporis? Autem aliquid a dolorum, totam dicta vitae beatae reprehenderit repudiandae cumque. Rem, possimus.</p>
                <p className='mt-4 text-base sm:text-xl'>Owner : Faisal</p>
            </main>
            {/* login link */}
            <footer className='basis-[10%] p-4'>
                <Link to='/login' className='text-xl sm:text-3xl transition-all duration-300 hover:text-blue-600'>Login Here</Link>
            </footer>
        </section>
    )
}

export default Public