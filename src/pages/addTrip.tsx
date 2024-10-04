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
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import * as React from "react";
import { useEffect, useState } from "react";
import { itIT } from "@mui/x-date-pickers/locales";

import "dayjs/locale/it";
import { useRouter } from "next/router";

interface Vehicle {
  id: number;
  name: string;
}

interface Driver {
  id: number;
  name: string;
}

const AddTrip: React.FC = () => {
  const [date, setDate] = useState<Dayjs>();
  const [tripTitle, setTripTitle] = useState<string>("");
  const [driverName, setDriverName] = useState<string>("");
  const [vehicleName, setVehicleName] = useState<string>("");
  const [drivers, setDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    fetchVehicles();
    fetchDrivers();
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

  const fetchDrivers = async () => {
    try {
      const response = await fetch("/api/drivers");
      if (!response.ok) {
        throw new Error("Errore durante il recupero degli autisti");
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

  const handleSaveTrip = async () => {
    try {
      if (date && tripTitle) {
        const response = await fetch("/api/trips", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date,
            tripTitle,
            vehicleName,
            driverName,
          }),
        });
        if (response.ok) {
          router.push('/')
        } else {
          const errorData = await response.json();
          alert(`Errore nella creazione del viaggio: ${errorData.error}`);
        }
      } else {
        alert("Compila i campi descrizione e data!");
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
          <FormControl fullWidth>
            <TextField
              label="Descrizione"
              variant="outlined"
              value={tripTitle}
              onChange={(event) => setTripTitle(event?.target?.value)}
            />
          </FormControl>
        </Box>
        <Box>
          <FormControl fullWidth>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale="it"
              localeText={
                itIT.components.MuiLocalizationProvider.defaultProps.localeText
              }
            >
              <DateTimePicker
                label={"Data"}
                value={date}
                onChange={(date) => (date ? setDate(date) : null)}
                format="dddd - DD/MM/YYYY - hh:mm"
                views={["day", "month", "year", "hours", "minutes"]}
                slots={{
                  textField: TextField,
                }}
                slotProps={{
                  textField: {
                    inputProps: {
                      readOnly: true
                    },
                  },
                }}
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
        <Box>
          <FormControl fullWidth>
            <InputLabel id="select-driver-label">Autista</InputLabel>
            <Select
              labelId="select-driver-label"
              id="select-driver-label"
              value={driverName}
              label="Autista"
              onChange={(event) => setDriverName(event?.target?.value)}
            >
              {drivers.length > 0 ? (
                drivers.map((driver, index) => (
                  <MenuItem key={index} value={driver.name}>
                    {driver.name}
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
