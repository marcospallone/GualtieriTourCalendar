import { Box, Button } from "@mui/material";
import * as React from "react";
import Calendar from "@/components/Calendar";
import AddIcon from "@mui/icons-material/Add";
import theme from "@/theme/theme";
import { useState } from "react";

const AddTrip: React.FC = () => {
  const [date, setDate] = useState<string>("20/07/2024");
  const [destination, setDestination] = useState<string>("dest");
  const [vehicleId, setVehicleId] = useState<number>(1);

  const handleSaveTrip = async () => {
    try {
      const response = await fetch("/api/trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          destination,
          vehicleId,
        }),
      });

      console.log(response)

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
          onClick={handleSaveTrip}
        >
          Salva
        </Button>
      </Box>
    </Box>
  );
};

export default AddTrip;
