"use client";
import react, { useState } from "react";
import { styled, alpha } from "@mui/material/styles";

import { Box, Toolbar, IconButton, Typography, AppBar, InputBase, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";

import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { redirect, useRouter } from "next/navigation";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function Navbar({ handleClick }) {
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

              <Search>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase placeholder="Search…" inputProps={{ "aria-label": "search" }} />
              </Search>
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
