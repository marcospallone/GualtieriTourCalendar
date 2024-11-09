import theme from "@/theme/theme";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useMediaQuery,
} from "@mui/material";
import {
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import * as React from "react";
import { useEffect, useState } from "react";
import { itIT } from "@mui/x-date-pickers/locales";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import "dayjs/locale/it";
import { useRouter } from "next/router";
import DoneIcon from '@mui/icons-material/Done';
import { authGuard } from "@/services/authGuard";
import { GetServerSideProps } from "next";

interface Vehicle {
  id: number;
  name: string;
}

interface Driver {
  id: number;
  name: string;
}

const AddService: React.FC = () => {
  const [date, setDate] = useState<Dayjs>();
  const [driver, setDriver] = useState<string>("");
  const [activity, setActivity] = useState<string>("");
  const [drivers, setDrivers] = useState<any[]>([]);

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const router = useRouter();

  useEffect(() => {
    fetchDrivers();
  }, []);

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

  const handleSaveService = async () => {
    try {
      if (date && driver) {
        const response = await fetch("/api/services", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            driver,
            activity
          }),
        });
        if (response.ok) {
          router.push("/");
        } else {
          const errorData = await response.json();
          alert(`Errore nella creazione del servizio: ${errorData.error}`);
        }
      } else {
        alert("Compila i campi autista e attività!");
      }
    } catch (error) {
      console.error("Errore nella chiamata POST:", error);
      alert("Errore nella creazione del servizio. Riprova più tardi.");
    }
  };

  return (
    <Box className={"main-box"}>
      <Box
        display={"flex"}
        flexDirection={"column"}
        rowGap={theme.spacing(12)}
        paddingTop={theme.spacing(12)}
      >
        <Box>
          <FormControl fullWidth>
            <InputLabel id="select-driver-label">Autista</InputLabel>
            <Select
              labelId="select-driver-label"
              id="select-driver-label"
              value={driver}
              label="Autista"
              onChange={(event) => setDriver(event?.target?.value)}
            >
              {drivers.length > 0 ? (
                drivers.map((driver, index) => (
                  <MenuItem key={index} value={driver.name}>
                    {driver.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value={""}>{"Nessun autista presente"}</MenuItem>
              )}
            </Select>
          </FormControl>
        </Box>
        <Box>
          <FormControl fullWidth>
            <TextField
              label="Attività"
              variant="outlined"
              value={activity}
              onChange={(event) => setActivity(event?.target?.value)}
            />
          </FormControl>
        </Box>
      </Box>
      <Box
        display={"flex"}
        justifyContent={"space-around"}
        padding={`0 ${theme.spacing(32)}`}
        marginTop={theme.spacing(16)}
        marginBottom={theme.spacing(16)}
      >
        <Box>
          <Button
            sx={{
              backgroundColor: "#018749",
              color: "#fff",
              padding: isMobile ? `${theme.spacing(6)} ${theme.spacing(12)}` : `${theme.spacing(12)} ${theme.spacing(32)}`,
              borderRadius: isMobile ? theme.spacing(12) : theme.spacing(18),
              fontSize: !isMobile ? theme.spacing(18) : 'normal'
            }}
            startIcon={<DoneIcon />}
            onClick={handleSaveService}
          >
            Salva
          </Button>
        </Box>
        <Box>
          <Button
            sx={{
              backgroundColor: "#A9A9A9",
              color: "#fff",
              padding: isMobile ? `${theme.spacing(6)} ${theme.spacing(12)}` : `${theme.spacing(12)} ${theme.spacing(32)}`,
              borderRadius: isMobile ? theme.spacing(12) : theme.spacing(18),
              fontSize: !isMobile ? theme.spacing(18) : 'normal'
            }}
            startIcon={<KeyboardBackspaceIcon />}
            onClick={() => router.push('/')}
          >
            Indietro
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddService;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return authGuard(context);
};
