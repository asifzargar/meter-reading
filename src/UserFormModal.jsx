import { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";

export default function UserFormModal({ open, onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (!name || !email) return alert("Fill all fields");
    const data = { name, email, password };
    onSubmit(data);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          bgcolor: "background.paper",
          p: 4,
          mx: "auto",
          mt: "10%",
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" mb={2} sx={{ color: "#000" }}>
          {"Create User"}
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" onClick={handleSubmit}>
              {"Create"}
            </Button>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}
