import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Chip,
} from "@mui/material";
import { FaEdit, FaTrash } from "react-icons/fa";

import { API_BASE_URL } from "../config";

const StorageManager = () => {
  const [storages, setStorages] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStorage, setCurrentStorage] = useState({
    name: "",
    type: "",
    connection_string: "",
  });

  useEffect(() => {
    fetchStorages();
  }, []);

  const fetchStorages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/connections`);
      const data = await response.json();

      const storagesArray = Array.isArray(data)
        ? data
        : Object.keys(data).map((key, index) => ({
            name: key,
            type: data[key].cloud,
            connection_string: data[key].data?.connection_string || "",
            status: index % 2 === 0 ? "active" : "inactive", // Mock status
            data: data[key].data, // Full data for JSON download
          }));

      setStorages(storagesArray);
    } catch (error) {
      console.error("Error fetching storages:", error);
    }
  };

  const handleDialogOpen = (
    storage = { name: "", type: "", connection_string: "" }
  ) => {
    setCurrentStorage(storage);
    setEditMode(!!storage.name);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentStorage({ name: "", type: "", connection_string: "" });
    setEditMode(false);
  };

  const handleSaveStorage = async () => {
    const method = editMode ? "PUT" : "POST";
    const endpoint = editMode
      ? `${API_BASE_URL}/connections/${currentStorage.name}`
      : `${API_BASE_URL}/connections`;

    const payload = {
      connection_name: currentStorage.name,
      cloud: currentStorage.type,
      data: {
        connection_string: currentStorage.connection_string,
      },
    };

    await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    fetchStorages();
    handleDialogClose();
  };

  const handleDeleteStorage = async (name) => {
    await fetch(`${API_BASE_URL}/connections/${name}`, { method: "DELETE" });
    fetchStorages();
  };

  const handleDownloadConfiguration = (storage) => {
    const fileName = `${storage.name}-configuration.json`;
    const fileContent = JSON.stringify(
      {
        [storage.name]: {
          cloud: storage.type,
          data: storage.data,
        },
      },
      null,
      2
    ); // Formato exacto

    const blob = new Blob([fileContent], { type: "application/json" });

    // Crear un enlace para descargar el archivo
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {storages.map((storage) => (
              <TableRow key={storage.name}>
                <TableCell>{storage.name}</TableCell>
                <TableCell>{storage.type}</TableCell>
                <TableCell>
                  <Chip
                    label={storage.status === "active" ? "Active" : "Inactive"}
                    style={{
                      backgroundColor:
                        storage.status === "active" ? "#4caf50" : "#2196f3",
                      color: "#fff",
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleDownloadConfiguration(storage)}
                  >
                    Download Configuration
                  </Button>
                  <Button
                    onClick={() => handleDialogOpen(storage)}
                    style={{ marginLeft: "10px" }}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => handleDeleteStorage(storage.name)}
                    style={{ marginLeft: "10px" }}
                  >
                    <FaTrash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleDialogOpen()}
        style={{ marginTop: "10px" }}
      >
        Add Storage
      </Button>

      {/* Dialog for Add/Edit */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {editMode ? "Edit Storage" : "Add New Storage"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Storage Name"
            value={currentStorage.name}
            onChange={(e) =>
              setCurrentStorage({ ...currentStorage, name: e.target.value })
            }
            fullWidth
            margin="dense"
            disabled={editMode}
          />
          <TextField
            label="Type"
            value={currentStorage.type}
            onChange={(e) =>
              setCurrentStorage({ ...currentStorage, type: e.target.value })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Connection String"
            value={currentStorage.connection_string}
            onChange={(e) =>
              setCurrentStorage({
                ...currentStorage,
                connection_string: e.target.value,
              })
            }
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveStorage} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StorageManager;
