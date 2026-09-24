import Button from "@mui/material/Button";
import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router";

function Home() {
  const { setHeader } = useOutletContext();
  const navigate = useNavigate();

  useEffect(()=>{
    setHeader("Welcome to DIY Tracker")
  },[])

  return (
    <>
      <Button variant="contained" onClick={() => navigate("/login")}>
        Login
      </Button>
      <Button
        variant="text"
        color="secondary"
        onClick={() => navigate("/signup")}
      >
        Create Account
      </Button>
    </>
  );
}

export default Home;
