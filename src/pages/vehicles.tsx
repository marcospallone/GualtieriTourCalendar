import {
  Box,
  Button,
  Fade,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";
import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import theme from "@/theme/theme";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useMemo, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

interface Vehicle {
  id: number;
  name: string;
}

const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);
  const [vehicleName, setVehicleName] = useState("");
  const handleNewVehicleClick = () => {
    setAdding(true);
  };

  const handleChangeVehicleName = (value: string) => {
    setVehicleName(value);
  };

  const handleSaveVehicleClick = async () => {
    try {
      if (vehicleName) {
        const response = await fetch("/api/vehicles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: vehicleName,
          }),
        });
        if (response.ok) {
          const vehicle = await response.json();
          if (vehicle) {
            setVehicleName("");
            fetchVehicles();
            setAdding(false);
          }
        } else {
          const errorData = await response.json();
          alert(`Errore nella creazione del veicolo: ${errorData.error}`);
        }
      } else {
        alert("Compila il campo nome!");
      }
    } catch (error) {
      console.error("Errore nella chiamata POST:", error);
      alert("Errore nella creazione del veicolo. Riprova più tardi.");
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/vehicles");
      if (!response.ok) {
        throw new Error("Errore durante il recupero dei veicoli");
      }
      const data: Vehicle[] = await response.json();
      const formattedVehicles = data.map((vehicle) => ({
        id: vehicle.id.toString(),
        name: vehicle.name,
      }));
      setVehicles(formattedVehicles);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteVehicle = async (id: number) => {
    const conferma = confirm("Sei sicuro di voler eliminare questo veicolo?");
    if (!conferma) return;
    try {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchVehicles();
        alert("Veicolo eliminato con successo");
      } else {
        const errorData = await response.json();
        alert(`Errore nell'eliminazione del veicolo: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Errore nella chiamata DELETE:", error);
      alert("Errore durante l'eliminazione del veicolo. Riprova più tardi.");
    }
  };

  useMemo(() => {
    fetchVehicles();
  }, []);

  return (
    <Box className={"main-box"}>
      {adding ? (
        <Fade in={adding} timeout={500}>
          <Box display={"flex"}>
            <Box>
              <TextField
                label="Nome"
                variant="outlined"
                value={vehicleName}
                onChange={(event) =>
                  handleChangeVehicleName(event?.target?.value)
                }
              />
            </Box>
            <Box
              sx={{
                width: "fit-content",
                borderRadius: theme.spacing(12),
                backgroundColor: "red",
                padding: `${theme.spacing(10)} ${theme.spacing(16)}`,
                marginLeft: theme.spacing(12),
                display: "flex",
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
                display: "flex",
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
      <Box>
        <List>
          {vehicles?.map((vehicle, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={vehicle?.name} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Vehicles;
