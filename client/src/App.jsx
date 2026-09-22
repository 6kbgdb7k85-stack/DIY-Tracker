import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import "./App.css";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {  Outlet, useLocation, useNavigate, useParams } from "react-router";
import useFetch from "./common/utils/useFetch";
import Button from "@mui/material/Button";

function App() {
  const [user, setUser] = useState(null);
  const { response: session, loading: sessionLoading } = useFetch("me");

  const navigate = useNavigate();
  const {projectId,taskId,toolId} = useParams()
  const location = useLocation()
  console.log(location)

  function returnToParentButton(){
    if(taskId){
      return <Button variant="contained" onClick={()=>navigate(`/projects/${projectId}`)}>Return to Project</Button>
    }else if(toolId){
      return <Button variant="contained" onClick={()=>navigate(-1)}>Return to Previous</Button>
    }else if (projectId){
      return <Button variant="contained" onClick={()=>navigate('/projects')}>Return to Dashboard</Button>
    }else{
      return <></>
    }
  }

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
          {returnToParentButton()}
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
