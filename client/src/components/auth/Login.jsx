import { useEffect, useState } from "react";
import useFetch from "../../common/utils/useFetch";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router";
import Typography from "@mui/material/Typography";
import { ALERT_TIMEOUT } from "../../common/constants/Numbers";

function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { setUser, setAlerts } = useOutletContext();

  const { state: locationState } = useLocation();
  const navigate = useNavigate();

  const {
    response: loginResponse,
    isLoading: loginLoading,
    runFetch: initLogin,
    error: loginError,
  } = useFetch("login", "POST", false);

  function handleLogin(e) {
    e.preventDefault();
    initLogin({ ...formData });
  }

  function handleChange(e) {
    const newData = { ...formData };
    newData[e.target.id] = e.target.value;
    setFormData(newData);
  }

  useEffect(() => {
    if (loginResponse) {
      setUser(loginResponse.user);
      localStorage.setItem("token", loginResponse.token);
      if (locationState) {
        navigate(locationState.from);
      } else {
        navigate("/projects");
      }
    }
  }, [loginResponse]);

  useEffect(() => {
    if (loginError) {
      setAlerts((prevState) => [...prevState, {...loginError.alert,id:crypto.randomUUID(),timeRemaining:ALERT_TIMEOUT}]);
    }
  }, [loginError]);

  return (
    <form>
      <TextField
        id="username"
        label="username"
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
      <Button onClick={handleLogin}>Login</Button>
      <Typography variant="body1">
        Don't have an account? Click <Link to={"/signup"}>here</Link> to sign up.
      </Typography>
    </form>
  );
}

export default Login;
