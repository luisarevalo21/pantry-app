"use client";
import { useState } from "react";
import { styled, alpha } from "@mui/material/styles";

import { Box, Toolbar, IconButton, Typography, AppBar, InputBase, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";

import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { redirect, useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  onAuthStateChanged(auth, user => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  });

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    setUser(user);
    router.push("/dashboard");
  };

  const handleSignOut = async () => {
    await auth.signOut();
    setUser(null);
    router.replace("/");
  };
  const [user, setUser] = useState(null);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky">
        <Toolbar sx={{ backgroundColor: "#334A52" }}>
          {/* <IconButton size="large" edge="start" color="inherit" aria-label="open drawer" sx={{ mr: 2 }}></IconButton> */}
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}>
            Pantry App
          </Typography>
          <Link href="/" passHref style={{ color: "white", marginRight: ".5em", textDecoration: "none" }}>
            Home
          </Link>
          {user && (
            <>
              <Link href="/dashboard" passHref style={{ color: "white", marginRight: ".5em", textDecoration: "none" }}>
                DashBoard
              </Link>
            </>
          )}

          {user !== null ? (
            <>
              <Button variant="contained" sx={{ marginLeft: "1em" }} onClick={handleSignOut}>
                <Typography marginLeft={".5em"}> Sign out</Typography>
              </Button>
            </>
          ) : (
            <>
              <Button variant="contained" sx={{ marginLeft: "1em" }} onClick={handleGoogleLogin}>
                <i className="fa fa-google" aria-hidden="true"></i>
                <Typography marginLeft={".5em"}> Sign in with Google</Typography>
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

// user ? (<Button variant="contained" sx={{ marginLeft: "1em" }} onClick={handleSign}>
//   <Typography marginLeft={".5em"}> Sign out</Typography>  ):

// ( <Button variant="contained" sx={{ marginLeft: "1em" }} onClick={handleGoogleLogin}>
// <i className="fa fa-google" aria-hidden="true"></i>
// <Typography marginLeft={".5em"}> Sign in with Google</Typography>
// </Button>)
