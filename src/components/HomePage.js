import React, { useRef, useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import RepositoryManager from "./RepositoryManager";
import StorageManager from "./StorageManager";
import CertificatesManager from "./CertificatesManager";
import { IconButton } from "@mui/material";
import { ToastContainer } from "react-toastify"; // Importa react-toastify
import "react-toastify/dist/ReactToastify.css"; // Asegúrate de importar los estilos

import { API_BASE_URL } from "../config";

// Registrar elementos y escalas
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function HomePage({ setIsLoggedIn }) {
  const repositoriesRef = useRef(null);
  const storagesRef = useRef(null);
  const [, setAddCertificatesToStorages] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const repositoriesHeight = repositoriesRef.current?.offsetHeight || 0;
    const storagesHeight = storagesRef.current?.offsetHeight || 0;
    setAddCertificatesToStorages(storagesHeight <= repositoriesHeight);
  }, []);

  const url = `${API_BASE_URL}/contentserver/receive`;

  const handleCopyClick = () => {
    navigator.clipboard.writeText(url).then(
      () => {
        window.alert("URL copied to clipboard!");
      },
      () => {
        window.alert("Failed to copy URL!");
      }
    );
  };
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // Mock data
  const pieData = {
    labels: ["Storage A", "Storage B", "Storage C"],
    datasets: [
      {
        data: [300, 150, 200],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const barData = {
    labels: ["Repository A", "Repository B", "Repository C"],
    datasets: [
      {
        label: "Saved Requests",
        backgroundColor: "rgba(75,192,192,0.6)",
        data: [65, 59, 80],
      },
      {
        label: "Retrieved Requests",
        backgroundColor: "rgba(153,102,255,0.6)",
        data: [28, 48, 40],
      },
    ],
  };

  const combinedBarData = {
    labels: [
      "Repo A on Storage A",
      "Repo B on Storage B",
      "Repo C on Storage C",
    ],
    datasets: [
      {
        label: "Storage A",
        backgroundColor: "#36A2EB",
        data: [60, 70, 80],
      },
      {
        label: "Storage B",
        backgroundColor: "#FF6384",
        data: [40, 50, 30],
      },
    ],
  };

  return (
    <div style={{ width: "100vw" }}>
      {/* Header */}
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
          boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.2)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src="https://storingpersonal.blob.core.windows.net/connections/Este.png?sp=r&st=2024-11-25T22:00:23Z&se=2027-11-25T06:00:23Z&spr=https&sv=2022-11-02&sr=b&sig=Dp5HIpyILiadPOga3h6AkeJgp0a8qV24bH6zhWtqYlA%3D"
              alt="Logo"
              style={{ width: "60px", height: "60px", marginRight: "15px" }}
            />
            <Typography
              variant="h4"
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#000",
              }}
            >
              Auritas Storage Manager
            </Typography>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "end",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="body1"
                style={{
                  fontSize: "16px",
                  color: "#555",
                  fontWeight: "500",
                  marginRight: "50px",
                }}
              >
                License Valid Until:{" "}
                <span style={{ fontWeight: "bold" }}>
                  Saturday, May 31, 2025
                </span>
              </Typography>
              <Typography
                variant="body1"
                style={{
                  fontSize: "16px",
                  color: "#555",
                  fontWeight: "500",
                }}
              >
                Logged as: <span style={{ fontWeight: "bold" }}>admin</span>
              </Typography>
              <Typography
                component="button"
                onClick={() => setIsLoggedIn(false)}
                style={{
                  fontSize: "16px",
                  color: "#555",
                  marginLeft: "10px",
                  marginRight: "20px",
                  fontWeight: "500",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Log Out
              </Typography>
            </div>
            <div>
              <Typography
                style={{
                  marginRight: "20px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Your SAP Content Server URL:
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginLeft: "8px",
                    textDecoration: "underline",
                    color: "blue",
                  }}
                >
                  {url}
                </a>
                {/* Usamos un emoji de copiar */}
                <span
                  onClick={handleCopyClick}
                  style={{ marginLeft: "8px", cursor: "pointer" }}
                  role="img"
                  aria-label="copy-icon"
                >
                  📋 {/* Emoji de portapapeles */}
                </span>
              </Typography>
            </div>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            height: "8px",
            borderRadius: "3px",
            marginTop: "10px",
            background: "linear-gradient(to right, #1976d2, #ff0000)",
          }}
        ></div>
      </header>

      {/* Main Content */}
      <div style={{ padding: "20px" }}>
        <Grid container spacing={3}>
          {/* Repositories Column */}
          <Grid item xs={12} md={6}>
            <div ref={repositoriesRef}>
              <Paper
                style={{
                  padding: "20px",
                  marginBottom: "20px",
                }}
              >
                <Typography variant="h5" color="primary" gutterBottom>
                  Repositories
                </Typography>
                <RepositoryManager />
              </Paper>

              <Paper
                style={{
                  padding: "20px",
                }}
              >
                <Typography variant="h5" color="primary" gutterBottom>
                  Certificates
                </Typography>
                <CertificatesManager />
              </Paper>
            </div>
          </Grid>

          {/* Storages Column */}
          <Grid item xs={12} md={6}>
            <div ref={storagesRef}>
              <Paper
                style={{
                  padding: "20px",
                  marginBottom: "20px",
                }}
              >
                <Typography variant="h5" color="primary" gutterBottom>
                  Storages
                </Typography>
                <StorageManager />
              </Paper>
              <Button
                variant="contained"
                color="primary"
                style={{ marginTop: "20px" }}
                onClick={handleOpenModal}
              >
                View Traffic and Statistics
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>

      {/* Modal for Traffic and Statistics */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="90vw"
        fullWidth
        PaperProps={{
          style: { height: "80%", width: "90%" },
        }}
      >
        <DialogTitle>Traffic and Statistics</DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              marginTop: "20px",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                flex: "1 1 22%", // Cada columna ocupa aproximadamente el 22% del ancho
              }}
            >
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                Data Volume Transferred
              </Typography>
              <Typography>
                Understand data flow patterns to optimize storage costs and
                anticipate future needs. Ideal for sectors like e-commerce,
                healthcare, and logistics.
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                flex: "1 1 22%",
              }}
            >
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                Requests by Repository or Storage
              </Typography>
              <Typography>
                Identify high-demand resources to improve prioritization and
                resource allocation. Vital for financial services and technology
                sectors.
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                flex: "1 1 22%",
              }}
            >
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                Average Latency of Operations
              </Typography>
              <Typography>
                Ensure smooth user experiences and improve critical operation
                response times. Essential for telecommunications and banking.
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                flex: "1 1 22%",
              }}
            >
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                Error and Success Rates
              </Typography>
              <Typography>
                Monitor the stability of data flow to minimize downtime and
                ensure service reliability. Key for manufacturing and online
                education.
              </Typography>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              marginTop: "40px",
            }}
          >
            <div style={{ width: "250px", height: "250px" }}>
              <Typography variant="h6" align="center">
                Traffic by Storage
              </Typography>
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            </div>
            <div style={{ width: "250px", height: "250px" }}>
              <Typography variant="h6" align="center">
                Requests by Repository
              </Typography>
              <Bar data={barData} options={{ maintainAspectRatio: false }} />
            </div>
            <div style={{ width: "250px", height: "250px" }}>
              <Typography variant="h6" align="center">
                Combined Repository & Storage
              </Typography>
              <Bar
                data={combinedBarData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default HomePage;
