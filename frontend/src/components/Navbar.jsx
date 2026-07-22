import React from 'react'
import { FaShieldAlt, FaGithub } from 'react-icons/fa'

const Navbar = () => {
    return (
        <nav className='bg-slate-900 border-b border-slate-700 shadow-md sticky top-0 z-50'>
            <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>

                <div className='flex items-center gap-3'>
                    <div className='bg-blue p-3 rounded-xl shadow-lg'>
                        <FaShieldAlt className="text-white text-xl" />
                    </div>


                    <div>
                        <h1 className='text-white text-2xl font-bold'>
                            Credit Card Fraud Detection
                        </h1>

                        <p className='text-slate-400 text-sm'>
                            AI Powered Banking Analytics Dashboard
                        </p>
                    </div>
                </div>

                <a href="https://github.com/codevansh" target='_blank' rel='noopener noreferrer' className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all duration-300 px-5 py-2.5 rounded-lg text-white font-medium shadow-lg'>
                    <FaGithub className='text-lg' /> Github
                </a>
            </div>
        </nav>
    )
}

export default Navbar