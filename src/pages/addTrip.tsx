import theme from "@/theme/theme";
import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import * as React from "react";
import { useEffect, useState } from "react";
import { itIT } from "@mui/x-date-pickers/locales";

import "dayjs/locale/it";

interface Vehicle {
  id: number;
  name: string;
}

const AddTrip: React.FC = () => {
  const [date, setDate] = useState<Dayjs>();
  const [tripTitle, setTripTitle] = useState<string>("");
  const [vehicleName, setVehicleName] = useState<string>("");
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    fetchVehicles();
  }, []);

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

  const handleSaveTrip = async () => {
    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date,
          tripTitle,
          vehicleName
        }),
      });
      if (response.ok) {
        const trip = await response.json();
        alert(`Viaggio creato con successo: ${trip.tripTitle}`);
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
      <Box>
        <Box>
          <FormControl>
            <TextField
              label="Viaggio"
              variant="outlined"
              value={tripTitle}
              onChange={(event) => setTripTitle(event?.target?.value)}
            />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="it"
              localeText={
                itIT.components.MuiLocalizationProvider.defaultProps.localeText
              }
            >
              <DatePicker
                label={"Data"}
                value={date}
                onChange={(date) => (date ? setDate(date) : null)}
                format="dddd - DD/MM/YYYY"
                views={["day", "month", "year"]}
              />
            </LocalizationProvider>
          </FormControl>
        </Box>
        <Box>
          <FormControl fullWidth>
            <InputLabel id="select-vehicle-label">Veicolo</InputLabel>
            <Select
              labelId="select-vehicle-label"
              id="select-vehicle-label"
              value={vehicleName}
              label="Veicolo"
              onChange={(event) => setVehicleName(event?.target?.value)}
            >
              {vehicles.length > 0 ? (
                vehicles.map((vehicle, index) => (
                  <MenuItem key={index} value={vehicle.name}>
                    {vehicle.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value={""}>{"Nessun veicolo presente"}</MenuItem>
              )}
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box
        sx={{
          width: "fit-content",
          borderRadius: theme.spacing(12),
          backgroundColor: "red",
          padding: `${theme.spacing(10)} ${theme.spacing(16)}`,
          display: "flex",
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
