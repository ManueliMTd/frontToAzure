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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
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
    data: {},
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
            data: data[key].data || {},
            status: index % 2 === 0 ? "active" : "inactive",
          }));

      setStorages(storagesArray);
    } catch (error) {
      console.error("Error fetching storages:", error);
    }
  };

  const handleDialogOpen = (storage = { name: "", type: "", data: {} }) => {
    let parsedData = { ...storage.data };

    // Asegurar que los datos sean correctos para cada tipo
    if (storage.type === "AZURE") {
      parsedData = {
        connection_string: storage.data?.connection_string || "",
        container_name: storage.data?.container_name || "",
      };
    } else if (storage.type === "AWS") {
      parsedData = {
        bucket_name: storage.data?.bucket_name || "",
        access_key: storage.data?.access_key || "", // Corregido para que coincida con "access_key"
        secret_key: storage.data?.secret_key || "", // Corregido para que coincida con "secret_key"
        region_name: storage.data?.region_name || "",
      };
    } else if (storage.type === "GCP") {
      parsedData = {
        bucket_name: storage.data?.bucket_name || "",
        credentials: storage.data?.credentials || {},
      };
    }

    setCurrentStorage({
      name: storage.name,
      type: storage.type,
      data: parsedData,
    });

    setEditMode(!!storage.name); // Si storage tiene nombre, está en modo edición
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentStorage({ name: "", type: "", data: {} });
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
      data: currentStorage.data,
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

  const handleFieldChange = (field, value) => {
    if (field === "type") {
      // Reset data when changing cloud type
      setCurrentStorage({ ...currentStorage, type: value, data: {} });
    } else {
      setCurrentStorage({ ...currentStorage, [field]: value });
    }
  };

  const handleDataFieldChange = (field, value) => {
    setCurrentStorage({
      ...currentStorage,
      data: { ...currentStorage.data, [field]: value },
    });
  };

  const renderDynamicFields = () => {
    switch (currentStorage.type) {
      case "AZURE":
        return (
          <>
            <TextField
              label="Connection String"
              value={currentStorage.data.connection_string || ""}
              onChange={(e) =>
                handleDataFieldChange("connection_string", e.target.value)
              }
              fullWidth
              margin="dense"
              required
            />
            <TextField
              label="Container Name"
              value={currentStorage.data.container_name || ""}
              onChange={(e) =>
                handleDataFieldChange("container_name", e.target.value)
              }
              fullWidth
              margin="dense"
              required
            />
          </>
        );
      case "AWS":
        return (
          <>
            <TextField
              label="Bucket Name"
              value={currentStorage.data.bucket_name || ""}
              onChange={(e) =>
                handleDataFieldChange("bucket_name", e.target.value)
              }
              fullWidth
              margin="dense"
              required
            />
            {console.log(currentStorage.data)}
            <TextField
              label="Access Key"
              value={currentStorage.data.access_key || ""} // Cambiado para que coincida con el nombre de la clave
              onChange={
                (e) => handleDataFieldChange("access_key", e.target.value) // Cambiado para que coincida con el nombre de la clave
              }
              fullWidth
              margin="dense"
              required
            />
            <TextField
              label="Secret Key"
              value={currentStorage.data.secret_key || ""} // Cambiado para que coincida con el nombre de la clave
              onChange={
                (e) => handleDataFieldChange("secret_key", e.target.value) // Cambiado para que coincida con el nombre de la clave
              }
              fullWidth
              margin="dense"
              required
            />
            <TextField
              label="Region Name"
              value={currentStorage.data.region_name || ""}
              onChange={(e) =>
                handleDataFieldChange("region_name", e.target.value)
              }
              fullWidth
              margin="dense"
              required
            />
          </>
        );

      case "GCP":
        return (
          <>
            <TextField
              label="Bucket Name"
              value={currentStorage.data.bucket_name || ""}
              onChange={(e) =>
                handleDataFieldChange("bucket_name", e.target.value)
              }
              fullWidth
              margin="dense"
              required
            />
            <TextField
              label="JSON Credentials"
              value={
                currentStorage.data.credentials
                  ? JSON.stringify(currentStorage.data.credentials, null, 2)
                  : ""
              }
              onChange={(e) => {
                try {
                  const parsedCredentials = JSON.parse(e.target.value);
                  handleDataFieldChange("credentials", parsedCredentials);
                } catch (error) {
                  console.error("Invalid JSON format:", error);
                }
              }}
              fullWidth
              margin="dense"
              required
              multiline
              helperText="Paste your JSON credentials here."
            />
          </>
        );
      default:
        return null;
    }
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
                  <Button onClick={() => handleDialogOpen(storage)}>
                    <FaEdit />
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => handleDeleteStorage(storage.name)}
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

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {editMode ? "Edit Storage" : "Add New Storage"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Storage Name"
            value={currentStorage.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            fullWidth
            margin="dense"
            disabled={editMode}
            required
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select
              value={currentStorage.type}
              onChange={(e) => handleFieldChange("type", e.target.value)}
              required
              disabled={editMode} // Deshabilitado en modo edición
            >
              <MenuItem value="AZURE">Azure</MenuItem>
              <MenuItem value="AWS">AWS</MenuItem>
              <MenuItem value="GCP">GCP</MenuItem>
            </Select>
          </FormControl>

          {renderDynamicFields()}
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
