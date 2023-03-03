import React from 'react'
import { Outlet } from 'react-router-dom'
import useTitle from '../hooks/useTitle'
import DashFooter from './DashFooter'
import DashHeader from './DashHeader'

const DashLayout = () => {
    useTitle("Dashboard")
    return (
        <section className='w-full h-screen bg-gray-900 text-gray-300 flex flex-col'>
            <header className='basis-[15%] flex items-center'>
                <DashHeader />
            </header>

            <main className='basis-[75%] p-2 md:p-4 border-y-2 text-gray-300'>
                <Outlet />
            </main>

            <footer className='basis-[10%] p-2 md:p-4'>
                <DashFooter />
            </footer>
        </section>
    )
}

export default DashLayout