import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
} from "@mui/material";

const CertificatesManager = () => {
  // Mock de datos para los certificados
  const [certificates] = useState([
    {
      id: 1,
      type: "SSL",
      validity: "2024-12-31",
      status: "Valid",
    },
    {
      id: 2,
      type: "TLS",
      validity: "2023-11-30",
      status: "Expired",
    },
  ]);

  const handleVerifyCertificate = (id) => {
    // Mock de verificación
    alert(`Verifying certificate with ID: ${id}`);
  };

  return (
    <div>
 
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Validity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {certificates.map((cert) => (
              <TableRow key={cert.id}>
                <TableCell>{cert.type}</TableCell>
                <TableCell>{cert.validity}</TableCell>
                <TableCell>
                  <Chip
                    label={cert.status}
                    style={{
                      backgroundColor:
                        cert.status === "Valid" ? "#4caf50" : "#f44336",
                      color: "#fff",
                    }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleVerifyCertificate(cert.id)}
                  >
                    Verify Certificate
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CertificatesManager;
