import {
  Box,
  Button,
  Divider,
  Fade,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  TextField,
  useMediaQuery,
} from "@mui/material";
import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import theme from "@/theme/theme";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { useMemo, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { GetServerSideProps } from "next";
import { authGuard } from "@/services/authGuard";

interface Vehicle {
  id: number;
  name: string;
}

const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);
  const [vehicleName, setVehicleName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

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
          setSnackbarOpen(true)
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
        setSnackbarOpen(true)
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
          <Box
            display={"flex"}
            flexDirection={isMobile ? "column" : "row"}
            paddingTop={theme.spacing(12)}
          >
            <Box>
              <FormControl fullWidth>
                <TextField
                  label="Nome"
                  variant="outlined"
                  value={vehicleName}
                  onChange={(event) =>
                    handleChangeVehicleName(event?.target?.value)
                  }
                />
              </FormControl>
            </Box>
            <Box
              display={"flex"}
              justifyContent={"space-around"}
              padding={`0 ${theme.spacing(32)}`}
              marginTop={isMobile ? theme.spacing(16) : 0}
              marginBottom={isMobile ? theme.spacing(16) : 0}
            >
              <Box>
                <Button
                  sx={{
                    backgroundColor: "#018749",
                    color: "#fff",
                    padding: isMobile
                      ? `${theme.spacing(6)} ${theme.spacing(12)}`
                      : `${theme.spacing(12)} ${theme.spacing(32)}`,
                    borderRadius: isMobile
                      ? theme.spacing(12)
                      : theme.spacing(18),
                    fontSize: !isMobile ? theme.spacing(18) : "normal",
                  }}
                  startIcon={<DoneIcon />}
                  onClick={handleSaveVehicleClick}
                >
                  Salva
                </Button>
              </Box>
              <Box marginLeft={isMobile ? 0 : theme.spacing(16)}>
                <Button
                  sx={{
                    backgroundColor: "#A9A9A9",
                    color: "#fff",
                    padding: isMobile
                      ? `${theme.spacing(6)} ${theme.spacing(12)}`
                      : `${theme.spacing(12)} ${theme.spacing(32)}`,
                    borderRadius: isMobile
                      ? theme.spacing(12)
                      : theme.spacing(18),
                    fontSize: !isMobile ? theme.spacing(18) : "normal",
                  }}
                  startIcon={<CloseIcon />}
                  onClick={() => setAdding(false)}
                >
                  Annulla
                </Button>
              </Box>
            </Box>
          </Box>
        </Fade>
      ) : (
        <Box paddingTop={theme.spacing(12)}>
          <Button
            sx={{
              backgroundColor: "#018749",
              color: "#fff",
              padding: `${theme.spacing(6)} ${theme.spacing(12)}`,
              borderRadius: theme.spacing(12),
            }}
            startIcon={<AddIcon />}
            onClick={handleNewVehicleClick}
          >
            Nuovo Veicolo
          </Button>
        </Box>
      )}
      <Box marginTop={theme.spacing(8)}>
        <List>
          {vehicles?.map((vehicle, index) => (
            <>
              <ListItem
                key={index}
                sx={{
                  paddingTop: theme.spacing(12),
                  paddingBottom: theme.spacing(12),
                }}
                secondaryAction={
                  <Box
                    sx={{
                      backgroundColor: "#B8001F",
                      borderRadius: "50%",
                    }}
                  >
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      sx={{ color: "#fff" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText primary={vehicle?.name} />
              </ListItem>
              <Divider component={"li"} />
            </>
          ))}
        </List>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="Operazione eseguita con successo"
        sx={{
          "&.MuiSnackbar-root": {
            bottom: "65px",
            backgroundColor: "#018749",
            borderRadius: theme.spacing(16),
          },
        }}
        ContentProps={{
          sx: {
            backgroundColor: "#018749",
            borderRadius: theme.spacing(16),
          },
        }}
      />
    </Box>
  );
};

export default Vehicles;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return authGuard(context);
};