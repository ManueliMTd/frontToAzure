import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
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
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { FaEdit, FaTrash } from "react-icons/fa";

import { API_BASE_URL } from "../config";

const RepositoryManager = () => {
  const [repositories, setRepositories] = useState([]);
  const [connections, setConnections] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRepo, setCurrentRepo] = useState({
    name: "",
    storage: "",
  });

  useEffect(() => {
    fetchRepositories();
    fetchStorages();
  }, []);

  const fetchRepositories = async () => {
    const response = await fetch(`${API_BASE_URL}/destinations`);
    const data = await response.json();
    setRepositories(Object.entries(data));
  };

  const fetchStorages = async () => {
    const response = await fetch(`${API_BASE_URL}/connections`);
    const data = await response.json();
    setConnections(Object.keys(data));
  };

  const handleDialogOpen = (repo = { name: "", storage: "" }) => {
    setCurrentRepo(repo);
    setEditMode(!!repo.name);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentRepo({ name: "", storage: "" });
    setEditMode(false);
  };

  const handleSaveRepo = async () => {
    const method = editMode ? "PUT" : "POST";
    const endpoint = editMode
      ? `${API_BASE_URL}/destinations/${currentRepo.name}`
      : `${API_BASE_URL}/destinations`;

    const payload = editMode
      ? { storage: currentRepo.storage }
      : { name: currentRepo.name, storage: currentRepo.storage };

    await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    fetchRepositories();
    handleDialogClose();
  };

  const handleDeleteRepo = async (name) => {
    await fetch(`${API_BASE_URL}/destinations/${name}`, { method: "DELETE" });
    fetchRepositories();
  };

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Storage</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {repositories.map(([name, storage]) => (
              <TableRow key={name}>
                <TableCell>{name}</TableCell>
                <TableCell>{storage}</TableCell>
                <TableCell align="center">
                  <Button onClick={() => handleDialogOpen({ name, storage })}>
                    <FaEdit />
                  </Button>
                  <Button
                    color="secondary"
                    onClick={() => handleDeleteRepo(name)}
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
        Add Repository
      </Button>

      {/* Dialog for Add/Edit */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>
          {editMode ? "Edit Repository" : "Add New Repository"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Repository Name"
            value={currentRepo.name}
            onChange={(e) =>
              setCurrentRepo({ ...currentRepo, name: e.target.value })
            }
            fullWidth
            margin="dense"
            disabled={editMode}
          />
          <Select
            label="Select Storage"
            value={currentRepo.storage}
            onChange={(e) =>
              setCurrentRepo({ ...currentRepo, storage: e.target.value })
            }
            fullWidth
            margin="dense"
          >
            {connections.map((storage) => (
              <MenuItem key={storage} value={storage}>
                {storage}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveRepo} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RepositoryManager;
