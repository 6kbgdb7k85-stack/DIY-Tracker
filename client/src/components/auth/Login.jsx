import React, { useEffect, useState } from "react";
import useFetch from "../../common/utils/useFetch";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useLocation, useNavigate, useOutletContext } from "react-router";

function Login() {
  const [formData, setFormData] = useState({
    username:'',
    password:''
  });
  const {setUser}=useOutletContext()

  const {state:locationState} = useLocation()
  const navigate = useNavigate()

  const {response:loginResponse,isLoading:loginLoading,runFetch:initLogin}=useFetch('login','POST',false);

  function handleLogin(e){
    e.preventDefault()
    initLogin({...formData})
  }

  function handleChange(e){
    const newData={...formData}
    newData[e.target.id]=e.target.value
    setFormData(newData)
  }

  useEffect(()=>{
    if(loginResponse){
      setUser(loginResponse.user)
      localStorage.setItem('token',loginResponse.token)
      if (locationState){
        navigate(locationState.from)
      }else{
        navigate('/projects')
      }
    }
  },loginResponse)

  return (
    <form
      
    >
      <TextField id="username" label="username" value={formData.username} onChange={handleChange}/>
      <TextField id="password" type="password" label="password" value={formData.password} onChange={handleChange}/>
      <Button onClick={handleLogin}>Login</Button>
    </form>
  );
}

export default Login;
