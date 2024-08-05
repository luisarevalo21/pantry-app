"use client";
import {
  Box,
  Typography,
  Button,
  TextField,
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { db, auth } from "../firebase";
import { useRouter } from "next/navigation";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { ClickAwayListener } from "@mui/material";
import { collection, getDocs, doc, setDoc, deleteDoc, where, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { onAuthStateChanged } from "firebase/auth";
import { InputBase } from "@mui/material";

const style = {
  transform: "translate(-50%, -50%)",
  display: "flex",
  flexDirection: "column",
};

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  border: "1px solid black",
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

export default function Home() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  const [rowIndex, setRowIndex] = useState(-1);
  const [columnIndex, setColumnIndex] = useState(-1);
  const [quantity, setQuantity] = useState(0);
  const [search, setSearch] = useState("");

  const getItems = async () => {
    const pantryList = [];

    const querySnapshot = await getDocs(collection(db, "pantry"));
    querySnapshot.forEach(doc => {
      pantryList.push(doc.data());
    });
    setItems(pantryList);
  };
  const getItem = async search => {
    if (!search) {
      getItems();
      return;
    }
    const q = query(collection(db, "pantry"), where("name", "==", search));

    const pantryList = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc => {
      pantryList.push(doc.data());
    });
    setItems(pantryList);
  };

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (auth.currentUser) {
        getItems();
      }
      if (auth.currentUser === null) {
        router.replace("/");
      }
    });
  }, []);

  const handleTextFieldChange = async (rowIndex, columnIndex, value) => {
    const newItems = items.map((item, i) => {
      if (i === rowIndex) {
        return { ...item, [columnIndex]: value };
      }
      return item;
    });
    setItems(newItems);

    const docRef = doc(collection(db, "pantry"), items[rowIndex].name);
    await setDoc(docRef, { name: items[rowIndex].name, quantity: value });
    getItems();
  };
  async function handleSubmit(e) {
    e.preventDefault();
    if (!newItem || !quantity) {
      return;
    }

    const item = {
      name: newItem,
      quantity,
    };

    const docRef = doc(collection(db, "pantry"), item.name);
    await setDoc(docRef, item);
    setQuantity("");
    setNewItem("");
    getItems();
  }

  const removeItem = async item => {
    const docRef = doc(collection(db, "pantry"), item.name);
    await deleteDoc(docRef);
    getItems();
  };

  const handleSearch = async e => {
    e.preventDefault();

    if (search === "") {
      getItems();
      return;
    }
    if (search) {
      getItem(search);
    }
  };
  return (
    <>
      <Box width={"100vw"} height={"100vh"} display={"flex"} flexDirection={"row"} justifyContent={"start"} gap={5}>
        <Container sx={{ width: "80vw", height: "50vh", marginTop: "2rem" }}>
          <form onSubmit={handleSearch}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                onChange={e => setSearch(e.target.value)}
              />
            </Search>
          </form>
          <Typography variant="h2" textAlign={"center"}>
            Pantry Management
          </Typography>
          <Box display={"flex"} alignContent={"center"} justifyContent={"center"} alignItems={"center"}>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Item Name"
                required
                margin="20px"
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
              ></TextField>
              <TextField
                type="number"
                label="Quanity"
                required
                value={quantity}
                InputProps={{
                  inputProps: { min: 0 },
                }}
                sx={{ marginLeft: "2em" }}
                onChange={e => {
                  setQuantity(e.target.value);
                }}
              ></TextField>
              <Button variant="contained" sx={{ marginLeft: "2em" }} type="submit">
                Add Item
              </Button>
            </form>
          </Box>

          <ClickAwayListener
            onClickAway={() => {
              setRowIndex(-1);
              setColumnIndex(-1);
            }}
          >
            <Table sx={{ width: "100%", marginTop: "1em" }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Item Name</TableCell>
                  <TableCell align="center">Quanity</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items.length === 0 && (
                  <TableRow>
                    <TableCell component={"td"} align="center" sx={{ fontSize: "1.2rem" }}>
                      No items found
                    </TableCell>
                  </TableRow>
                )}
                {items.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell component={"td"} align="center" sx={{ fontSize: "1.2rem" }}>
                      {item.name}
                    </TableCell>
                    <TableCell
                      component={"td"}
                      align="center"
                      sx={{ fontSize: "1.2rem", cursor: "pointer" }}
                      typeof="number"
                      onClick={() => {
                        setRowIndex(i);
                        setColumnIndex(1);
                      }}
                    >
                      {rowIndex === i && columnIndex === 1 ? (
                        <TextField
                          placeholder={item.quantity}
                          type="number"
                          InputProps={{
                            inputProps: { min: 0 },
                          }}
                          defaultValue={item.quantity}
                          onChange={e => {
                            handleTextFieldChange(i, "quantity", e.target.value);
                          }}
                          onKeyDown={e => {
                            if (e.key === "Enter") {
                              setRowIndex(-1);
                              setColumnIndex(-1);
                            }
                          }}
                        />
                      ) : (
                        item.quantity
                      )}
                    </TableCell>
                    <TableCell component={"td"} align="center" sx={{ fontSize: "1.2rem" }}>
                      {/* <AddIcon onClick={() => incrementItem(item)} />
                    <RemoveIcon onClick={() => decrementItem(item)} /> */}
                      {/* <EditIcon onClick={() => editItem(item)} /> */}
                      <DeleteIcon onClick={() => removeItem(item)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ClickAwayListener>
        </Container>
      </Box>
    </>
  );
}
