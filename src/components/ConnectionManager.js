// src/components/ConnectionManager.js
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
  Typography,
  IconButton,
} from "@mui/material";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importar iconos de react-icons

const ConnectionManager = () => {
  const [connections, setConnections] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentConnection, setCurrentConnection] = useState({
    name: "",
    cloud: "",
    connection_string: "",
    container_name: "",
  });

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/connections`);
      const data = await response.json();

      // Convertir data a array si es un objeto
      const connectionsArray = Array.isArray(data)
        ? data
        : Object.keys(data).map((key) => ({
            name: key,
            cloud: data[key].cloud,
            connection_string: data[key].data.connection_string,
            container_name: data[key].data.container_name,
          }));

      setConnections(connectionsArray);
    } catch (error) {
      console.error("Error fetching connections:", error);
    }
  };

  const handleDialogOpen = (
    connection = {
      name: "",
      cloud: "",
      connection_string: "",
      container_name: "",
    }
  ) => {
    setCurrentConnection(connection);
    setEditMode(!!connection.name);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentConnection({
      name: "",
      cloud: "",
      connection_string: "",
      container_name: "",
    });
    setEditMode(false);
  };

  const handleSaveConnection = async () => {
    const method = editMode ? "PUT" : "POST";
    const endpoint = editMode
      ? `${process.env.REACT_APP_API_URL}/connections/${currentConnection.name}`
      : `${process.env.REACT_APP_API_URL}/connections`;

    const payload = {
      connection_name: currentConnection.name,
      cloud: currentConnection.cloud,
      data: {
        connection_string: currentConnection.connection_string,
        container_name: currentConnection.container_name,
      },
    };

    await fetch(endpoint, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    fetchConnections();
    handleDialogClose();
  };

  const handleDeleteConnection = async (name) => {
    await fetch(`${process.env.REACT_APP_API_URL}/connections/${name}`, { method: "DELETE" });
    fetchConnections();
  };

  return (
    <div>
      <Typography variant="h5" color="primary">
        Connection Manager
      </Typography>
      <List>
        {connections.map((conn) => (
          <ListItem
            key={conn.name}
            secondaryAction={
              <>
                <IconButton
                  edge="end"
                  color="primary"
                  onClick={() => handleDialogOpen(conn)}
                >
                  <FaEdit />
                </IconButton>
                <IconButton
                  edge="end"
                  color="secondary"
                  onClick={() => handleDeleteConnection(conn.name)}
                >
                  <FaTrash />
                </IconButton>
              </>
            }
          >
            <ListItemText
              primary={conn.name}
              secondary={`Cloud: ${conn.cloud}, Container: ${conn.container_name}`}
            />
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleDialogOpen()}
      >
        Add Connection
      </Button>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {editMode ? "Edit Connection" : "Add New Connection"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Connection Name"
            value={currentConnection.name}
            onChange={(e) =>
              setCurrentConnection({
                ...currentConnection,
                name: e.target.value,
              })
            }
            fullWidth
            margin="dense"
            disabled={editMode}
          />
          <TextField
            label="Cloud Provider"
            value={currentConnection.cloud}
            onChange={(e) =>
              setCurrentConnection({
                ...currentConnection,
                cloud: e.target.value,
              })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Connection String"
            value={currentConnection.connection_string}
            onChange={(e) =>
              setCurrentConnection({
                ...currentConnection,
                connection_string: e.target.value,
              })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Container Name"
            value={currentConnection.container_name}
            onChange={(e) =>
              setCurrentConnection({
                ...currentConnection,
                container_name: e.target.value,
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
          <Button onClick={handleSaveConnection} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ConnectionManager;
