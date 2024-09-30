import { Box, Button, Fade, TextField } from "@mui/material";
import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import theme from "@/theme/theme";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

const Vehicles: React.FC = () => {
  const [adding, setAdding] = React.useState(false);
  const [vehicleName, setVehicleName] = React.useState('');
  const handleNewVehicleClick = () => {
    setAdding(true);
  };

  const handleSaveVehicleClick = async () => {
    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicleName
        }),
      });

      console.log(response);

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
    setAdding(false);
  };
  return (
    <Box className={"main-box"}>
      {adding ? (
        <Fade in={adding} timeout={500}>
          <Box display={"flex"}>
            <Box>
              <TextField label="Nome" variant="outlined" />
            </Box>
            <Box
              sx={{
                width: "fit-content",
                borderRadius: theme.spacing(12),
                backgroundColor: "red",
                padding: `${theme.spacing(10)} ${theme.spacing(16)}`,
                marginLeft: theme.spacing(12),
              }}
            >
              <Button
                sx={{ color: "#fff" }}
                startIcon={<DoneIcon />}
                onClick={handleSaveVehicleClick}
              >
                Salva
              </Button>
            </Box>{" "}
            <Box
              sx={{
                width: "fit-content",
                borderRadius: theme.spacing(12),
                backgroundColor: "gray",
                padding: `${theme.spacing(10)} ${theme.spacing(16)}`,
                marginLeft: theme.spacing(12),
              }}
            >
              <Button
                sx={{ color: "#fff" }}
                startIcon={<CloseIcon />}
                onClick={() => setAdding(false)}
              >
                Annulla
              </Button>
            </Box>
          </Box>
        </Fade>
      ) : (
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
            onClick={handleNewVehicleClick}
          >
            Nuovo Veicolo
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Vehicles;
