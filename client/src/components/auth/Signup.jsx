import { useEffect, useState } from "react";
import useFetch from "../../common/utils/useFetch";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate, useOutletContext } from "react-router";

function Login() {
  const [formData, setFormData] = useState({
    username:'',
    password:''
  });
  const {setUser}=useOutletContext()

  const navigate = useNavigate()

  const {response:signupResponse,isLoading:signupLoading,runFetch:createAccount}=useFetch('signup','POST',false);

  function handleLogin(e){
    e.preventDefault()
    createAccount({...formData})
  }

  function handleChange(e){
    const newData={...formData}
    newData[e.target.id]=e.target.value
    setFormData(newData)
  }

  useEffect(()=>{
    if(signupResponse){
      setUser(signupResponse.user)
      localStorage.setItem('token',signupResponse.token)
      navigate('/projects')
    }
  },signupResponse)

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
