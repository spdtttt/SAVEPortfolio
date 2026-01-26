import { useNavigate } from "react-router-dom"
import axios from "axios"
import { useEffect, useState } from "react"

const Profile = () => {
  const navigate = useNavigate()
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }

      try {
        const response = await axios.get('http://localhost:3001/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setMessage(response.data.username)
      } catch(err) {
        console.error('Authentication Error', err);
        handleLogout();
      }
    }

    fetchProfileData();
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')  
  }

  return (
    <div>
      <h2 className="text-2xl text-white">{message}</h2>
      <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded" onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Profile