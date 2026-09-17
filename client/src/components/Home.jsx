import Button from "@mui/material/Button";
import { useNavigate } from "react-router";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <h1>Welcome to DIY Tracker</h1>
      <Button onClick={()=>navigate("/login")}>Login</Button>
    </>
  );
}

export default Home;
