import "./App.css";
import React, { useEffect, useState } from "react";

// Material
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

// Firebase
import firebaseConfig from "./firebaseConfig";
import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions"; // Call FB functions in your app
import {
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";

// Components
import {FileUploader, FileList} from "./components/StorageComponents";

const app = initializeApp(firebaseConfig);
// Access your FB functions
const functions = getFunctions(app);

// Enable Google-based auth login
const auth = getAuth();
const provider = new GoogleAuthProvider();

function signIn() {
  signInWithPopup(auth, provider);
}

function signOut2() {
  signOut(auth);
}

function InnerApp(props) {
  const {userid} = props;

  return <Box sx={{ flexGrow: 1, margin: 10 }}>
    <FileList userid={userid}></FileList>
  </Box>;
}

/* props.pageName */
function AuthApp(props) {
  const { pageName } = props;
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      user ? setUser(user.uid) : setUser(null);
    });
  });

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1}}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {pageName}
            </Typography>
            {user ? (
              <Button color="inherit" onClick={signOut2}>
                Logout
              </Button>
            ) : (
              <Button color="inherit" onClick={signIn}>
                Login
              </Button>
            )}
          </Toolbar>
        </AppBar>
        {user ? <InnerApp userid={user}/> : ""}
      </Box>
    </div>
  );
}

export default AuthApp;
