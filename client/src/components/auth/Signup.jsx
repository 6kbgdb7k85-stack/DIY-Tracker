import { useEffect, useState } from "react";
import useFetch from "../../common/utils/useFetch";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, useNavigate, useOutletContext } from "react-router";
import Typography from "@mui/material/Typography";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formErrors,setFormErrors]=useState(null)
  const { setUser } = useOutletContext();

  const navigate = useNavigate();

  const {
    response: signupResponse,
    isLoading: signupLoading,
    runFetch: createAccount,
    error: createAccountError,
  } = useFetch("signup", "POST", false);

  function handleLogin(e) {
    e.preventDefault();
    createAccount({ ...formData });
  }

  function handleChange(e) {
    const newData = { ...formData };
    newData[e.target.id] = e.target.value;
    setFormData(newData);
  }

  useEffect(() => {
    if (signupResponse) {
      setUser(signupResponse.user);
      localStorage.setItem("token", signupResponse.token);
      navigate("/projects");
    }
  }, signupResponse);

  useEffect(()=>{
    if(createAccountError){
      setFormErrors(createAccountError.fieldErrors)
    }else{
      setFormErrors(null)
    }
  },[createAccountError])

  return (
    <form>
      <TextField
        id="username"
        label="Username"
        error={formErrors?.username}
        helperText={formErrors?.username.join(', ')}
        value={formData.username}
        onChange={handleChange}
      />
      <TextField
        id="password"
        type="password"
        label="password"
        value={formData.password}
        onChange={handleChange}
      />
      <Button onClick={handleLogin}>Create Account</Button>
      <Typography variant="body1">
        Already have an account? Click <Link to={"/login"}>here</Link> to login.
      </Typography>
    </form>
  );
}

export default Login;
