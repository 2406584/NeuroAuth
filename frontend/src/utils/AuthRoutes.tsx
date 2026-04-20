import { Route } from 'react-router'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Dashboard from '../pages/Dashboard'

const AuthRoutes = ({ authenticated }: { authenticated: boolean }) => {
    if (authenticated) {
        return (
            <>
                <Route path="/dashboard" element={<Dashboard />} />
            </>
        )
    } else {
        return (
            <>
                <Route path="/login" element={<Login setAuthenticated={() => authenticated} />} />
                <Route path="/register" element={<Register />} />
            </>
        )
    }
}

export default AuthRoutes