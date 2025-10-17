import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/User/Register'
import AdminHome from './components/Admin/Home'
import Add from './components/Admin/Add'
import Update from './components/Admin/Update'
import Home from './components/User/Home'
import UserProfile from './components/User/UserProfile'
import BlogDetails from './components/User/Blogdetails'
import AdminUserProfile from './components/Admin/UsersProfile'
import AdminDashboard from './components/Admin/AdminDashboard'
import ManageUsers from './components/Admin/ManageUsers'
import ForgotPassword from './components/User/ForgotPassword'
import AdminViewBlog from './components/Admin/AdminViewBlog'

function App() {
  const [count, setCount] = useState(0)

  return (
<Routes>


<Route path='/' element={<Login/>}/>


  //////////////////////admin//////////////////////


  <Route path='/admin-dash' element={<AdminDashboard/>}/>
  <Route path='/admin-view-blog' element={<AdminHome/>}/>
  <Route path='/admin-add-blog' element={<Add/>}/>
  <Route path='/admin-update-blog/:id' element={<Update/>}/>
  <Route path='/admin-view-user/:id' element={<AdminUserProfile/>}/>
  <Route path='/admin-manage-users' element={<ManageUsers/>}/>

  <Route path='/admin-view-single-blog/:id' element={<AdminViewBlog/>}/>






////////////////////////user//////////////////////////

<Route path='/register' element={<Register/>}/>
<Route path='/user-dash' element={<Home/>}/>
<Route path='/user-profile' element={<UserProfile/>}/>
<Route path='/blog-details/:id' element={<BlogDetails/>}/>
<Route path='forget-password' element={<ForgotPassword/>}/>





</Routes>
  )
}

export default App
