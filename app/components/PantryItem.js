import { Box, Typography, Button, Card } from "@mui/material";

export default function PantryItem({ item, removeItem }) {
  return (
    <Box
      key={item}
      width="50%"
      //   flexDirection={"column"}
      textAlign={"left"}
      minHeight="150px"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bgcolor="#f0f0f0"
      paddingX={2}
      gap={5}
    >
      <Typography variant="h3" color="#333" textAlign={"center"} textTransform={"capitalize"}>
        {item}
      </Typography>
      <Button variant="contained" onClick={() => removeItem(item)}>
        Remove
      </Button>
    </Box>
  );
}
