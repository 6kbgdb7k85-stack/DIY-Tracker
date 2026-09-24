import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router";

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <>
      <Typography sx={{ textAlign: "center" }} variant="h4">
        You don't have access to this page
      </Typography>
      <Box sx={{ textAlign: "center" }}>
        <Button onClick={() => navigate("/projects")}>Home</Button>
      </Box>
    </>
  );
}
