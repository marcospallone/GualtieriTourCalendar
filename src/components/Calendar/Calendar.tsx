import FullCalendar from "@fullcalendar/react";
import {
  Box,
  Button,
  Divider,
  Fade,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import * as React from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useState } from "react";
import itLocale from "@fullcalendar/core/locales/it";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import theme from "@/theme/theme";
import { formatDate } from "@fullcalendar/core";
import styles from "./Calendar.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import drivers from "@/pages/drivers";
import vehicles from "@/pages/vehicles";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { itIT } from "@mui/x-date-pickers/locales";
import "dayjs/locale/it";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/router";

interface Trip {
  id: number;
  date: string;
  tripTitle: string;
  vehicleName: string;
  driverName: string;
}

interface Vehicle {
  id: number;
  name: string;
}

interface Driver {
  id: number;
  name: string;
}

const Calendar: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [dayTrips, setDayTrips] = useState<any[]>([]);
  const [showTripList, setShowTripList] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventInModal, setEventInModal] = useState<any>({});
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);

  const router = useRouter();

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  useEffect(() => {
    fetchTrips();
    fetchVehicles();
    fetchDrivers();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await fetch("/api/trips");
      if (!response.ok) {
        throw new Error("Errore durante il recupero dei viaggi");
      }
      const data: Trip[] = await response.json();
      const formattedEvents = data.map((trip) => ({
        id: trip.id.toString(),
        title: trip.tripTitle,
        start: trip.date,
        vehicleName: trip.vehicleName,
        driverName: trip.driverName,
      }));
      setTrips(formattedEvents);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(trips);
  }, [trips]);

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
      const response = await fetch(`/api/trips/${eventInModal?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: eventInModal?.date,
          tripTitle: eventInModal?.title,
          vehicleName: eventInModal?.vehicleName,
          driverName: eventInModal?.driverName,
        }),
      });

      if (response.ok) {
        fetchTrips();
        setModalOpen(false);
      } else {
        const errorData = await response.json();
        alert(`Errore nella modifica del viaggio: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Errore nella chiamata PUT:", error);
      alert("Errore durante la modifica del viaggio. Riprova più tardi.");
    }
  };

  const handleDeleteTrip = async () => {
    const conferma = confirm("Sei sicuro di voler eliminare questo viaggio?");
    if (!conferma) return;

    try {
      const response = await fetch(`/api/trips/${eventInModal?.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTrips();
        setModalOpen(false);
      } else {
        const errorData = await response.json();
        alert(`Errore nell'eliminazione del viaggio: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Errore nella chiamata DELETE:", error);
      alert("Errore durante l'eliminazione del viaggio. Riprova più tardi.");
    }
  };

  const handleCellClick = (info: any) => {
    const dateStr = new Intl.DateTimeFormat("it-IT", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(info.date);
    if (isMobile) {
      const eventsOnDay = trips.filter((event) => {
        const eventDateStr = new Intl.DateTimeFormat("it-IT", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date(event.start));
        return eventDateStr === dateStr;
      });
      console.log(eventsOnDay);
      setDayTrips(eventsOnDay);
      setShowTripList(true);
    }
  };

  const renderEventContent = (eventInfo: any) => {
    return (
      <Box>
        <Typography variant="h6" component={"p"}>
          {eventInfo.timeText.includes(":")
            ? eventInfo.timeText
            : eventInfo.timeText + ":00"}
        </Typography>
        <Typography variant="body1" component={"p"}>
          {eventInfo.event.title}
        </Typography>
      </Box>
    );
  };

  const handleCellContent = (info: any) => {
    console.log(info);
    if (isMobile) {
      const dateStr = new Intl.DateTimeFormat("it-IT", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(info.date);
      const eventsOnDay = trips.filter((event) => {
        const eventDateStr = new Intl.DateTimeFormat("it-IT", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date(event.start));
        return eventDateStr === dateStr;
      });
      const eventCount =
        eventsOnDay.length > 0 ? `${eventsOnDay.length} eventi` : "";

      return (
        <Box>
          <Box>{info.dayNumberText}</Box>
          {eventCount && (
            <Box
              className="event-count"
              style={{ fontSize: "0.8em", color: "#ff5722" }}
            >
              {eventCount}
            </Box>
          )}
        </Box>
      );
    } else {
      return (
        <Box>
          <Box>{info.dayNumberText}</Box>
        </Box>
      );
    }
  };

  const handleEventClick = (info: any) => {
    console.log(info.event);
    const formattedDay = new Intl.DateTimeFormat("it-IT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(info.event.start);

    const formattedTime = new Intl.DateTimeFormat("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(info.event.start);
    const formattedDate = `${formattedDay} - ${formattedTime}`;
    let event = {
      id: info.event.id,
      title: info.event.title,
      date: dayjs(info.event.start),
      formattedDate: formattedDate,
      driverName: info.event._def.extendedProps.driverName,
      vehicleName: info.event._def.extendedProps.vehicleName,
    };
    setEventInModal(event);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Box sx={{ filter: modalOpen ? "blur(8px)" : "none" }}>
        <Box>
          <FullCalendar
            locale={itLocale}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={trips}
            dateClick={handleCellClick}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            dayCellContent={handleCellContent}
            eventDisplay={isMobile ? "none" : undefined}
          />
        </Box>
        {showTripList && (
          <List>
            {dayTrips.map((trip, index) => {
              const validDate = new Date(trip.start);
              const formattedDay = new Intl.DateTimeFormat("it-IT", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }).format(validDate);

              const formattedTime = new Intl.DateTimeFormat("it-IT", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }).format(validDate);
              const date = `${formattedDay} - ${formattedTime}`;

              return (
                <ListItem key={index}>
                  <Box>
                    <Box>
                      <Typography>{trip.title}</Typography>
                    </Box>
                    <Box>
                      <Typography>{date}</Typography>
                    </Box>
                    <Box>
                      <Typography>{trip.driverName}</Typography>
                    </Box>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        )}
        <Box></Box>
      </Box>
      <Modal
        className={styles.modal}
        open={modalOpen}
        onClose={handleCloseModal}
      >
        <Box display={"flex"} flexDirection={"column"}>
          <Box display={"flex"} justifyContent={"flex-end"}>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon sx={{ color: "#fff" }} />
            </IconButton>
          </Box>
          <Box>
            <Box>
              <FormControl fullWidth>
                <TextField
                  label="Descrizione"
                  variant="outlined"
                  value={eventInModal?.title}
                  onChange={(event) =>
                    (eventInModal.title = event?.target?.value)
                  }
                />
              </FormControl>
            </Box>
            <Box>
              <FormControl fullWidth>
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="it"
                  localeText={
                    itIT.components.MuiLocalizationProvider.defaultProps
                      .localeText
                  }
                >
                  <DateTimePicker
                    label={"Data"}
                    value={eventInModal?.date}
                    onChange={(date) =>
                      date ? (eventInModal.date = date) : null
                    }
                    format="dddd - DD/MM/YYYY - hh:mm"
                    views={["day", "month", "year", "hours", "minutes"]}
                    slots={{
                      textField: TextField,
                    }}
                    slotProps={{
                      textField: {
                        inputProps: {
                          readOnly: true,
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
                  value={eventInModal?.vehicleName}
                  label="Veicolo"
                  onChange={(event) =>
                    (eventInModal.vehicleName = event?.target?.value)
                  }
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
                  value={eventInModal?.driverName}
                  label="Autista"
                  onChange={(event) =>
                    (eventInModal.driverName = event?.target?.value)
                  }
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
            <Box>
              <Divider textAlign="center">
                <Typography
                  variant="body1"
                  component="span"
                  sx={{ padding: "1rem" }}
                >
                  oppure
                </Typography>
              </Divider>
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
                onClick={handleDeleteTrip}
              >
                Elimina viaggio
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Calendar;
