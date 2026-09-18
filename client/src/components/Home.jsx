import Button from "@mui/material/Button";
import { useNavigate } from "react-router";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <h1>Welcome to DIY Tracker</h1>
      <Button variant="contained" onClick={()=>navigate("/login")}>Login</Button>
      <Button variant="text" color="secondary" onClick={()=>navigate("/signup")}>Create Account</Button>
    </>
  );
}

export default Home;
