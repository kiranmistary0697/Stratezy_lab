import React from 'react'
import { Outlet } from 'react-router-dom'
import AuthProvider from './AuthContext'

const ContextWrapper = () => {
    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    )
}

export default ContextWrapper
