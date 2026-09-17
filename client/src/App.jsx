import { useState } from 'react'
import AppBar from '@mui/material/AppBar';
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Outlet } from 'react-router';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h1' sx={{flexGrow:1}}>DIY Tracker</Typography>
        </Toolbar>
      </AppBar>
      <Outlet/>
    </>
  )
}

export default App
