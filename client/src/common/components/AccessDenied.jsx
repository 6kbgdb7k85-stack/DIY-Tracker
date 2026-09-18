import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import React from "react";
import { useNavigate } from "react-router";

export default function AccessDenied(){
    const navigate = useNavigate();

    return(<>
        <Typography variant="h4">You don't have access to this page</Typography>
        <Button onClick={()=>navigate('/projects')}>Home</Button>
    </>)
}