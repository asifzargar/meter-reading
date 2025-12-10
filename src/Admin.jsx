import { useEffect, useState } from "react";
import UserFormModal from "./UserFormModal";
import { enqueueSnackbar } from "notistack";
import Api from "./services/api";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Button,
  Switch,
  Backdrop,
  CircularProgress,
} from "@mui/material";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await Api.get("/auth/users");
      setLoading(false);
      setUsers(res);
    } catch (e) {
      setLoading(false);
      enqueueSnackbar("Somthing went wrong", {
        variant: "error",
      });
      console.log(e);
    }
  };
  useEffect(() => {
    loadUsers();
  }, []);

  const deleteUser = async (id) => {
    setLoading(true);
    try {
      await Api.del(`/auth/delete/${id}`, {});
      enqueueSnackbar("Succesfully deleted", {
        variant: "success",
      });
      setLoading(false);
      loadUsers();
    } catch (e) {
      setLoading(false);
      enqueueSnackbar("Somthing went wrong", {
        variant: "error",
      });
      console.log(e);
    }
  };
  const toggleUser = async (id) => {
    setLoading(true);
    try {
      await Api.post(`/auth/toggle/${id}`, {});
      enqueueSnackbar("Succesfully toggle", {
        variant: "success",
      });
      setLoading(false);
      loadUsers();
    } catch (e) {
      setLoading(false);
      enqueueSnackbar("Somthing went wrong", {
        variant: "error",
      });
      console.log(e);
    }
  };

  const createUser = async (data) => {
    setLoading(true);
    try {
      await Api.post(`/auth/create`, data);
      enqueueSnackbar("Succesfully user created", {
        variant: "success",
      });
      setOpenForm(false);
      setLoading(false);
      loadUsers();
    } catch (e) {
      setLoading(false);
      enqueueSnackbar("Somthing went wrong", {
        variant: "error",
      });
      console.log(e);
    }
  };

  const handleCreate = async (data) => {
    await createUser(data);
  };

  return (
    <div style={{ padding: 20, color: "#000", textAlign: "left" }}>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <h1>Admin Panel</h1>

      <Button
        sx={{ mt: 2 }}
        variant="outlined"
        onClick={() => {
          setOpenForm(true);
        }}
      >
        + Create User
      </Button>

      <UserFormModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleCreate}
      />

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Email</b>
              </TableCell>
              <TableCell>
                <b>Status</b>
              </TableCell>
              <TableCell>
                <b>Expires At</b>
              </TableCell>
              <TableCell>
                <b>Actions</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((u) => (
              <TableRow key={u._id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.isActive ? "Active" : "Inactive"}</TableCell>
                <TableCell>
                  {u.expiresAt
                    ? new Date(u.expiresAt).toLocaleTimeString()
                    : "-"}
                </TableCell>

                <TableCell>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={async () => {
                      await deleteUser(u._id);
                    }}
                  >
                    Delete
                  </Button>
                  <Switch
                    checked={u.isActive}
                    onChange={async () => {
                      await toggleUser(u._id);
                      loadUsers();
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
