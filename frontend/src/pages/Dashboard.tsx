import { Button } from '@mantine/core'
import React from 'react'

const Dashboard = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login'; // Redirect to login page after logout
  }
  return (
    <div>
      <h1>Welcome to the Dashboard 🚀 </h1>
      <p>This is a protected route. You have successfully accessed the dashboard.</p>
      <Button onClick={handleLogout} variant='light' color='red'>Logout</Button>
    </div>
  )
}

export default Dashboard