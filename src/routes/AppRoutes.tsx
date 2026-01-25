import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Profile from "../pages/Profile"
import TopBar from '../components/TopBar'

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <TopBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/profile' element={<Profile />} />
            </Routes>
        </BrowserRouter>
    )
}