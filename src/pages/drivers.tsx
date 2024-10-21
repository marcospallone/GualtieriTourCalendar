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

interface Driver {
  id: number;
  name: string;
}

const Drivers: React.FC = () => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);
  const [driverName, setDriverName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const handleNewDriverClick = () => {
    setAdding(true);
  };

  const handleChangeDriverName = (value: string) => {
    setDriverName(value);
  };

  const handleSaveDriverClick = async () => {
    try {
      if (driverName) {
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
            setDriverName("");
            fetchDrivers();
            setAdding(false);
          }
          setSnackbarOpen(true);
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

  const handleDeleteDriver = async (id: number) => {
    const conferma = confirm("Sei sicuro di voler eliminare questo autista?");
    if (!conferma) return;
    try {
      const response = await fetch(`/api/drivers/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchDrivers();
        setSnackbarOpen(true);
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
                  value={driverName}
                  onChange={(event) =>
                    handleChangeDriverName(event?.target?.value)
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
                  onClick={handleSaveDriverClick}
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
            onClick={handleNewDriverClick}
          >
            Nuovo Autista
          </Button>
        </Box>
      )}
      <Box marginTop={theme.spacing(8)}>
        <List>
          {drivers?.map((driver, index) => (
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
                      onClick={() => handleDeleteDriver(driver.id)}
                      sx={{ color: "#fff" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText primary={driver?.name} />
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

export default Drivers;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return authGuard(context);
};
