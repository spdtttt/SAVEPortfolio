import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import OtpVerify from "../pages/otpVerify"
import Profile from "../pages/Profile"
import Layout from '../Layout'
import ProtectedRoute from '../ProtectedRoute'

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path='/login' element={<Layout><Login /></Layout>} />
                <Route path='/register' element={<Layout><Register /></Layout>} />
                <Route path='/otp-verify' element={<Layout><OtpVerify /></Layout>} />
                
                <Route element={<ProtectedRoute />}>
                    <Route path='/profile' element={<Layout><Profile /></Layout>} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}