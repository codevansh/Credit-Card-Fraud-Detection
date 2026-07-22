import React from 'react'
import Navbar from './components/Navbar'
import CSVPrediction from './components/CSVPrediction'

const App = () => {
  return (
    <div className='min-h-screen bg-slate-950'>
      <Navbar />
      <main className='max-w-7xl mx-auto px-6 py-10'>
        <CSVPrediction />
      </main>
    </div>
  )
}

export default App