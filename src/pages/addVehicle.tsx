import { Box, Button, TextField } from "@mui/material";
import * as React from "react";
import Calendar from "@/components/Calendar";
import AddIcon from "@mui/icons-material/Add";
import theme from "@/theme/theme";
import { useState } from "react";

const AddVehicle: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [trips, setTrips] = useState<[]>([]);

  const handleSaveVehicle = async () => {
    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          trips,
        }),
      });
      if (response.ok) {
        const trip = await response.json();
        alert(`Viaggio creato con successo: ${trip.destination}`);
      } else {
        const errorData = await response.json();
        alert(`Errore nella creazione del viaggio: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Errore nella chiamata POST:", error);
      alert("Errore nella creazione del viaggio. Riprova più tardi.");
    }
  };

  return (
    <Box className={"main-box"}>
      <Box
        sx={{
          width: "fit-content",
          borderRadius: theme.spacing(12),
          backgroundColor: "red",
          padding: `${theme.spacing(10)} ${theme.spacing(16)}`,
        }}
      >
        <Button
          sx={{ color: "#fff" }}
          startIcon={<AddIcon />}
          onClick={handleSaveVehicle}
        >
          Salva
        </Button>
      </Box>
      <Box>
        <TextField label="Nome" variant="outlined" />
      </Box>
    </Box>
  );
};

export default AddVehicle;
