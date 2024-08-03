"use client";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  Container,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
} from "@mui/material";
import { db, auth } from "../firebase";
import { redirect, useRouter } from "next/navigation";

import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { onAuthStateChanged } from "firebase/auth";

const style = {
  transform: "translate(-50%, -50%)",
  display: "flex",
  flexDirection: "column",
};

// const items = ["potatoe", "tomato", "onion", "carrot", "cucumber", "apple", "banana"];

export default function Home() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [newItem, setNewItem] = useState("");

  const [quantity, setQuantity] = useState(0);

  const getItems = async () => {
    const pantryList = [];
    const querySnapshot = await getDocs(collection(db, "pantry"));
    querySnapshot.forEach(doc => {
      pantryList.push(doc.data());
    });
    setItems(pantryList);
  };
  // useEffect(() => {
  //   getItems();
  // }, []);

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      console.log("auth", auth);
      if (auth.currentUser) {
        getItems();
      }
      if (auth.currentUser === null) {
        router.replace("/");
      }
    });
  }, []);
  // const handleAddItem = async item => {
  //   // const docRef = doc(collection(firestore, "pantry"), item);
  //   await setDoc(doc(collection(firestore, "pantry"), item), {});
  //   getItems();
  // };
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
    getItems();
  }

  async function incrementItem(item) {
    const docRef = doc(collection(db, "pantry"), item.name);
    await setDoc(docRef, { name: item.name, quantity: +item.quantity + 1 });
    getItems();
  }

  async function decrementItem(item) {
    if (item.quantity === 0) {
      // removeItem(item);
      return;
    }
    const docRef = doc(collection(db, "pantry"), item.name);
    await setDoc(docRef, { name: item.name, quantity: +item.quantity - 1 });
    getItems();
  }
  //remove based on quanitty not item itself
  const removeItem = async item => {
    const docRef = doc(collection(db, "pantry"), item.name);
    await deleteDoc(docRef);
    getItems();
  };

  const editItem = async () => {
    return;
  };

  return (
    <>
      <Box width={"100vw"} height={"100vh"} display={"flex"} flexDirection={"row"} justifyContent={"start"} gap={5}>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            style={style}
            position={"absolute"}
            left="50%"
            top={"50%"}
            width={400}
            bgcolor="background.paper"
            border="2px solid #000"
            boxShadow={24}
            p={2}
            gap={3}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add
            </Typography>
            <Stack width="100%" direction={"row"} spacing={2}>
              <TextField
                id="outlined-basic"
                label="Outlined"
                variant="outlined"
                fullWidth
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
              />
              <Button
                variant="contained"
                onClick={() => {
                  handleAddItem(newItem);
                  setNewItem("");
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Container sx={{ width: "80vw", height: "50vh", marginTop: "2rem" }}>
          <Typography variant="h2" textAlign={"center"}>
            Pantry Management
          </Typography>
          <Box display={"flex"} alignContent={"center"} justifyContent={"center"} alignItems={"center"}>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Item Name"
                required
                margin="20px"
                onChange={e => setNewItem(e.target.value)}
              ></TextField>
              <TextField
                type="number"
                label="Quanity"
                required
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

          <Table sx={{ width: "100%", marginTop: "1em" }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">Item Name</TableCell>
                <TableCell align="center">Quanity</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {items.map((item, i) => (
                <TableRow key={i}>
                  <TableCell component={"td"} align="center" sx={{ fontSize: "1.2rem" }}>
                    {item.name}
                  </TableCell>
                  <TableCell component={"td"} align="center" sx={{ fontSize: "1.2rem" }} typeof="number">
                    {item.quantity}
                  </TableCell>
                  <TableCell component={"td"} align="center" sx={{ fontSize: "1.2rem" }}>
                    <AddIcon onClick={() => incrementItem(item)} />
                    <RemoveIcon onClick={() => decrementItem(item)} />
                    <DeleteIcon onClick={() => removeItem(item)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Container>
      </Box>
    </>
  );
}
