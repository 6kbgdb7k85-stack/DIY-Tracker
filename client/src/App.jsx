import { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Outlet, useLocation, useNavigate, useParams } from "react-router";
import useFetch from "./common/utils/useFetch";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider } from "@emotion/react";
import { metalTheme, woodTheme } from "./assets/themes";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

function App() {
  const [header, setHeader] = useState("");
  const [theme, setTheme] = useState(woodTheme);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [user, setUser] = useState(null);
  const {
    response: session,
    loading: sessionLoading,
    runFetch: checkMe,
  } = useFetch("me");

  const navigate = useNavigate();
  const location = useLocation();
  const { projectId, taskId, toolId } = useParams();

  useEffect(() => {
    if (session) {
      setUser(session.username);
    }
  }, [session]);

  function returnToParentButton() {
    let button;
    if (taskId) {
      button = (
        <Button
          sx={{ alignSelf: "right" }}
          variant="contained"
          onClick={() => navigate(`/projects/${projectId}`)}
        >
          Return to Project
        </Button>
      );
    } else if (toolId) {
      let prevText = "Dashboard";
      if (location.state?.prevLocation.includes("task")) {
        prevText = "Task";
      }
      button = (
        <Button
          sx={{
            alignSelf: "right",
            textAlign: "right",
            alignContent: "right",
            alignItems: "right",
            flexGrow: 1,
          }}
          variant="contained"
          onClick={() => navigate(location.state?.prevLocation || "projects")}
        >
          Return to {prevText}
        </Button>
      );
    } else if (projectId) {
      button = (
        <Button
          sx={{ alignSelf: "right" }}
          variant="contained"
          onClick={() => navigate("/projects")}
        >
          Return to Dashboard
        </Button>
      );
    }
    return <Grid size={button ? "auto" : "grow"}>{button || <></>}</Grid>;
  }

  function closeMenu(){
    setMenuAnchor(null)
  }

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={closeMenu}
          >
            <MenuItem
              onClick={() => {
                closeMenu();
                setTheme(woodTheme);
              }}
            >
              Use Wood Theme
            </MenuItem>
            <MenuItem
              onClick={() => {
                closeMenu();
                setTheme(metalTheme);
              }}
            >
              Use Metal Theme
            </MenuItem>
          </Menu>
          <Typography variant="h1" sx={{ flexGrow: 1 }}>
            DIY Tracker
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Grid container sx={{ alignItems: "center", justifyContent: "center" }}>
        <Grid size={"grow"} />
        <Grid size={{ md: 9, xs: 12 }}>
          <Typography variant="h2" sx={{ flexGrow: 1, textAlign: "center" }}>
            {header}
          </Typography>
        </Grid>
        {returnToParentButton()}
      </Grid>
      <Outlet
        context={{ setUser, user, sessionLoading, session, checkMe, setHeader }}
      />
    </ThemeProvider>
  );
}

export default App;
