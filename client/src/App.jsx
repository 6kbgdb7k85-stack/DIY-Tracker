import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import "./App.css";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {  Outlet, useNavigate } from "react-router";
import useFetch from "./common/utils/useFetch";
import Button from "@mui/material/Button";

function App() {
  const [user, setUser] = useState(null);
  const { response: session, loading: sessionLoading } = useFetch("me");

  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      setUser(session.username)
    }
  }, [session]);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h1" sx={{ flexGrow: 1 }}>
            DIY Tracker
          </Typography>
          <Button variant="contained" onClick={() => {localStorage.removeItem("token");navigate('/')}}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Outlet context={{ setUser, user, sessionLoading, session }} />
    </>
  );
}

export default App;
