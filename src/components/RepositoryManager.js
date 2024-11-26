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
    contRep: "",
    connection_name: "",
  });

  // Mock data for remaining space
  const remainingSpaceData = {
    repo1: "10 GB",
    repo2: "5 GB",
    repo3: "15 GB",
  };

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

  const handleDialogOpen = (repo = { contRep: "", connection_name: "" }) => {
    setCurrentRepo(repo);
    setEditMode(!!repo.contRep);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentRepo({ contRep: "", connection_name: "" });
    setEditMode(false);
  };

  const handleSaveRepo = async () => {
    const method = editMode ? "PUT" : "POST";
    const endpoint = editMode
      ? `${API_BASE_URL}/destinations/${currentRepo.contRep}`
      : `${API_BASE_URL}/destinations`;

    const payload = editMode
      ? { connection_name: currentRepo.connection_name }
      : {
          contRep: currentRepo.contRep,
          connection_name: currentRepo.connection_name,
        };

    await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    fetchRepositories();
    handleDialogClose();
  };

  const handleDeleteRepo = async (contRep) => {
    await fetch(`${API_BASE_URL}/destinations/${contRep}`, {
      method: "DELETE",
    });
    fetchRepositories();
  };

  const handleDownloadPreviousRepositories = (contRep) => {
    const mockData = {
      repoName: contRep,
      urls: [
        "https://example.com/file1",
        "https://example.com/file2",
        "https://example.com/file3",
      ],
    };

    const blob = new Blob([JSON.stringify(mockData, null, 2)], {
      type: "application/json",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${contRep}_previous_repositories.json`;
    link.click();
  };

  return (
    <div>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Storage</TableCell>
              <TableCell>Remaining Space</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {repositories.map(([contRep, connection_name]) => (
              <TableRow key={contRep}>
                <TableCell>{contRep}</TableCell>
                <TableCell>{connection_name}</TableCell>
                <TableCell>
                  {remainingSpaceData[contRep] || "Unknown"}
                </TableCell>
                <TableCell style={{display:"flex", flexDirection:"row", width:"90%"}}>
                  <Button
                    style={{ width: "70%" }}
                    variant="contained"
                    color="default"
                    onClick={() => handleDownloadPreviousRepositories(contRep)}
                  >
                    Prev Storages
                  </Button>
                  <Button
                    style={{ width: "15%" }}
                    onClick={() =>
                      handleDialogOpen({ contRep, connection_name })
                    }
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    style={{ width: "15%" }}
                    color="secondary"
                    onClick={() => handleDeleteRepo(contRep)}
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
            value={currentRepo.contRep}
            onChange={(e) =>
              setCurrentRepo({ ...currentRepo, contRep: e.target.value })
            }
            fullWidth
            margin="dense"
            disabled={editMode}
          />
          <Select
            label="Select Storage"
            value={currentRepo.connection_name}
            onChange={(e) =>
              setCurrentRepo({
                ...currentRepo,
                connection_name: e.target.value,
              })
            }
            fullWidth
            margin="dense"
          >
            {connections.map((connection_name) => (
              <MenuItem key={connection_name} value={connection_name}>
                {connection_name}
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
