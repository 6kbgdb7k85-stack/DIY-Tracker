import Alert from "@mui/material/Alert";

export default function AlertWrapper({severity,message}){
    return <Alert severity={severity}>{message}</Alert>

}