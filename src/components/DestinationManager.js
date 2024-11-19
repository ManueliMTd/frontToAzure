// src/components/DestinationManager.js
import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  Typography,
  IconButton,
} from "@mui/material";
import { API_BASE_URL } from "../config";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importar iconos de react-icons

const DestinationManager = () => {
  const [destinations, setDestinations] = useState([]);
  const [connections, setConnections] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDestination, setCurrentDestination] = useState({
    contRep: "",
    connection_name: "",
  });

  useEffect(() => {
    fetchDestinations();
    fetchConnections();
  }, []);

  const fetchDestinations = async () => {
    const response = await fetch(`${API_BASE_URL}/destinations`);
    const data = await response.json();
    setDestinations(Object.entries(data)); // Convertir a array de pares [contRep, connection_name]
  };

  const fetchConnections = async () => {
    const response = await fetch(`${API_BASE_URL}/connections`);
    const data = await response.json();
    setConnections(Object.keys(data));
  };

  const handleDialogOpen = (
    destination = { contRep: "", connection_name: "" }
  ) => {
    setCurrentDestination(destination);
    setEditMode(!!destination.contRep);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentDestination({ contRep: "", connection_name: "" });
    setEditMode(false);
  };

  const handleSaveDestination = async () => {
    const method = editMode ? "PUT" : "POST";
    const endpoint = editMode
      ? `${API_BASE_URL}/destinations/${currentDestination.contRep}`
      : `${API_BASE_URL}/destinations`;

    // Construir el payload según el método
    const payload = editMode
      ? { connection_name: currentDestination.connection_name } // Solo `connection_name` para `PUT`
      : {
          contRep: currentDestination.contRep,
          connection_name: currentDestination.connection_name,
        }; // Ambos campos para `POST`

    await fetch(endpoint, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    fetchDestinations();
    handleDialogClose();
  };

  const handleDeleteDestination = async (contRep) => {
    await fetch(`${API_BASE_URL}/destinations/${contRep}`, {
      method: "DELETE",
    });
    fetchDestinations();
  };

  return (
    <div>
      <Typography variant="h5" color="primary">
        Destination Manager
      </Typography>
      <List>
        {destinations.map(([contRep, connection_name]) => (
          <ListItem
            key={contRep}
            secondaryAction={
              <>
                <IconButton
                  edge="end"
                  color="primary"
                  onClick={() => handleDialogOpen({ contRep, connection_name })}
                >
                  <FaEdit />
                </IconButton>
                <IconButton
                  edge="end"
                  color="secondary"
                  onClick={() => handleDeleteDestination(contRep)}
                >
                  <FaTrash />
                </IconButton>
              </>
            }
          >
            <ListItemText primary={contRep} secondary={connection_name} />
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleDialogOpen()}
      >
        Add Destination
      </Button>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {editMode ? "Edit Destination" : "Add New Destination"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Destination Name"
            value={currentDestination.contRep}
            onChange={(e) =>
              setCurrentDestination({
                ...currentDestination,
                contRep: e.target.value,
              })
            }
            fullWidth
            margin="dense"
            disabled={editMode}
          />
          <Select
            label="Select Connection"
            value={currentDestination.connection_name}
            onChange={(e) =>
              setCurrentDestination({
                ...currentDestination,
                connection_name: e.target.value,
              })
            }
            fullWidth
            margin="dense"
          >
            {connections.map((conn) => (
              <MenuItem key={conn} value={conn}>
                {conn}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveDestination} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DestinationManager;