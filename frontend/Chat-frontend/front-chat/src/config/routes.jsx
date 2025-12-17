import React from 'react'
import { Route, Routes } from 'react-router-dom'
import App from '../App'
import ChatPage from '../components/ChatPage'

const AppRoutes = () => {
  return (
    <div>
      <Routes>
         <Route path="/" element={<App/>}/>
        <Route path="/chat" element={<ChatPage/>}/>
      </Routes>
    </div>
  )
}

export default AppRoutes
