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

interface Driver {
  id: number;
  name: string;
}

const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);
  const [driverName, setDriverName] = useState("");
  const handleNewDriverClick = () => {
    setAdding(true);
  };

  const handleChangeDriverName = (value: string) => {
    setDriverName(value);
  };

  const handleSaveDriverClick = async () => {
    try {
      const response = await fetch("/api/drivers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: driverName,
        }),
      });
      if (response.ok) {
        const driver = await response.json();
        if (driver) {
          setDriverName('')
          fetchDrivers();
        }
      } else {
        const errorData = await response.json();
        alert(`Errore nella creazione del veicolo: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Errore nella chiamata POST:", error);
      alert("Errore nella creazione del veicolo. Riprova più tardi.");
    }
    setAdding(false);
  };

  const fetchDrivers = async () => {
    try {
      const response = await fetch("/api/drivers");
      if (!response.ok) {
        throw new Error("Errore durante il recupero dei veicoli");
      }
      const data: Driver[] = await response.json();
      const formattedDrivers = data.map((driver) => ({
        id: driver.id.toString(),
        name: driver.name,
      }));
      setDrivers(formattedDrivers);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteVehicle = async (id: number) => {
    const conferma = confirm("Sei sicuro di voler eliminare questo autista?");
    if (!conferma) return;
    try {
      const response = await fetch(`/api/drivers/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchDrivers();
        alert("Autista eliminato con successo");
      } else {
        const errorData = await response.json();
        alert(`Errore nell'eliminazione dell'autista: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Errore nella chiamata DELETE:", error);
      alert("Errore durante l'eliminazione dell'autista. Riprova più tardi.");
    }
  };

  useMemo(() => {
    fetchDrivers();
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
                value={driverName}
                onChange={(event) =>
                  handleChangeDriverName(event?.target?.value)
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
                onClick={handleSaveDriverClick}
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
            onClick={handleNewDriverClick}
          >
            Nuovo Autista
          </Button>
        </Box>
      )}
      <Box>
        <List>
          {drivers?.map((driver, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteVehicle(driver.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={driver?.name} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Drivers;
