import { Typography, Box, Button } from "@mui/material";

export default function Home() {
  return (
    <Box display={"flex"} flexDirection={"column"} justifyContent={"space-around"} width={"100vw"} height={"100vh"}>
      <Box display={"flex"} flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
        <Typography variant="h2" fontWeight={"bold"}>
          Welcome to Pantry Manager
        </Typography>
        <Typography marginTop={".1em"}>Easily manage your pantry items and keep track of what you have.</Typography>

        <Button variant="contained" sx={{ marginTop: ".9em" }}>
          Get Started
        </Button>
      </Box>

      <Box display={"flex"} justifyContent={"space-evenly"} textAlign={"center"} marginTop={"1em"}>
        <Box>
          <Typography variant="h4">Easy to use</Typography>
          <Typography> Our user-friendly interface makes it easy to manage </Typography>
        </Box>
        <Box>
          <Typography variant="h4">Track Items</Typography>
          <Typography> Keep track of inventory</Typography>
        </Box>
        <Box>
          <Typography variant="h4">Manage Items</Typography>
          <Typography>Add/Delete inventory</Typography>
        </Box>
      </Box>
    </Box>
  );
}
