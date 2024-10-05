import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/auth'
import Chat from './pages/chat'
import Profile from './pages/profile'
import { useAppStore } from './Store'
import { apiClient } from './lib/api_client'
import { GET_USER_INFO } from './Utils/Constant'
// import './App.css'

const PrivateRoute = ({children})=>{
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to={'/auth'} />
}

const AuthRoute = ({children})=>{
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to={'/chat'} /> : children;
}

function App() {
  const {userInfo,setUserInfo}=useAppStore();
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
        try {
            const response = await apiClient.get(GET_USER_INFO, { withCredentials: true });
            if (response.status === 200 && response.data.user._id) {
                setUserInfo(response.data.user);
            } else {
                setUserInfo(undefined);
            }
        } catch (error) {
            setUserInfo(undefined);
        } finally {
            setloading(false);
        }
    };

    if (!userInfo) {
        getUserData();
    } else {
        setloading(false);
    }
}, [userInfo, setUserInfo]);

  if(loading){
    return <div>Loading...</div>  // replace with your own loading component here  // if you want to use a loading spinner or something else.
  }

  return (
   <BrowserRouter>
   <Routes>
    <Route path='/auth' element={<AuthRoute>
      <Auth />
    </AuthRoute>}  />

    <Route path='/chat' element={<PrivateRoute>
      <Chat />
    </PrivateRoute>}  />
    <Route path='/profile' element={<PrivateRoute>
      <Profile />
    </PrivateRoute>}  />

    <Route path='*' element={<Navigate to={'/auth'} />} />
   </Routes>
   </BrowserRouter>
  )
}

export default App
