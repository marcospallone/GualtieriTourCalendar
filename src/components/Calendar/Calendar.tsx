import FullCalendar from "@fullcalendar/react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import * as React from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";
import itLocale from "@fullcalendar/core/locales/it";
import interactionPlugin from "@fullcalendar/interaction";
import theme from "@/theme/theme";
import styles from "./Calendar.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { itIT } from "@mui/x-date-pickers/locales";
import "dayjs/locale/it";
import dayjs from "dayjs";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
  const [idEventInModal, setIdEventInModal] = useState<any>({});
  const [titleEventInModal, setTitleEventInModal] = useState<any>({});
  const [dateEventInModal, setDateEventInModal] = useState<any>();
  const [vehicleEventInModal, setVehicleEventInModal] = useState<string>("");
  const [driverEventInModal, setDriverEventInModal] = useState<string>("");
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [actualDay, setActualDay] = useState<any>();

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
      return formattedEvents;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const date = actualDay || new Date();
    getDayTrips(date);
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
      const response = await fetch(`/api/trips/${idEventInModal}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: dateEventInModal,
          tripTitle: titleEventInModal,
          vehicleName: vehicleEventInModal,
          driverName: driverEventInModal,
        }),
      });

      if (response.ok) {
        await fetchTrips();
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

  const handleDeleteTrip = async (id: any, date: any) => {
    const conferma = confirm("Sei sicuro di voler eliminare questo viaggio?");
    if (!conferma) return;

    try {
      const response = await fetch(
        `/api/trips/${isMobile ? id : idEventInModal}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        await fetchTrips();
        if (isMobile) {
          let info = {
            date: actualDay,
          };
          handleCellClick(info);
        }
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

  const getDayTrips = (date: any) => {
    const validDate = new Date(date);
    const dateStr = new Intl.DateTimeFormat("it-IT", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(validDate);
    if (isMobile) {
      const eventsOnDay = trips.filter((event) => {
        const eventDateStr = new Intl.DateTimeFormat("it-IT", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date(event.start));
        return eventDateStr === dateStr;
      });
      setDayTrips(eventsOnDay);
    }
  };

  const [touchStartY, setTouchStartY] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTouchStart = (e: any) => {
    setTouchStartY(e.touches[0].clientY);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: any) => {
    const touchEndY = e.touches[0].clientY;
    const swipeDistance = touchEndY - touchStartY;

    if (swipeDistance > 0) {
      setTranslateY(swipeDistance);
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    if (translateY > 50) {
      setShowTripList(false);
    } else {
      setTranslateY(0);
    }
  };

  const handleCellClick = (info: any) => {
    setActualDay(info.date);
    getDayTrips(info.date);
    setTranslateY(0);
    setShowTripList(true);
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
      const eventCount = eventsOnDay.length;

      return (
        <Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography component={"span"}>{info.dayNumberText}</Typography>
          </Box>
          {eventCount > 0 && (
            <Box
              className="event-count"
              sx={{
                backgroundColor: "#EB8317",
                color: "#10375C",
                display: "flex",
                justifyContent: "center",
                padding: theme.spacing(4),
                borderRadius: "30%",
                marginTop: theme.spacing(6),
              }}
            >
              <Typography
                variant="button"
                component={"span"}
                fontWeight={"bold"}
              >
                {eventCount}
              </Typography>
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
    if (isMobile) {
      setIdEventInModal(info.id);
      setTitleEventInModal(info.title);
      setDateEventInModal(dayjs(info.start));
      setVehicleEventInModal(info.vehicleName);
      setDriverEventInModal(info.driverName);
      setActualDay(info.start);
    } else {
      setIdEventInModal(info.event.id);
      setTitleEventInModal(info.event.title);
      setDateEventInModal(dayjs(info.event.start));
      setVehicleEventInModal(info.event.extendedProps.vehicleName);
      setDriverEventInModal(info.event.extendedProps.driverName);
      setActualDay(info.event.start);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Box sx={{ filter: modalOpen ? "blur(8px)" : "none" }}>
        <Box marginTop={theme.spacing(16)}>
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
            headerToolbar={{
              right: "prev,next",
            }}
            height={theme.spacing(459)}
            fixedWeekCount={false}
          />
        </Box>
        {showTripList ? (
          <>
            <Paper
              sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                padding: theme.spacing(16),
                borderRadius: `${theme.spacing(16)} ${theme.spacing(16)} 0 0`,
                transform: `translateY(${translateY}px)`,
                transition: isSwiping ? "none" : "transform 0.3s ease-out",
                zIndex: 1,
              }}
              elevation={4}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Box display={"flex"} justifyContent={"flex-end"}>
                <IconButton
                  onClick={() => setShowTripList(false)}
                  sx={{
                    backgroundColor: "#F4F6FF",
                    color: "#2C3E50",
                    padding: `${theme.spacing(6)}`,
                    borderRadius: "50%",
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <Box>
                <List disablePadding>
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
                      <>
                        <ListItem key={index}>
                          <Box width={"100%"}>
                            <Box>
                              <Typography
                                component={"span"}
                                variant="body1"
                                fontWeight={"bold"}
                              >
                                {trip.title}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography
                                component={"span"}
                                variant="body1"
                                fontWeight={"bold"}
                              >
                                Data:{" "}
                              </Typography>
                              <Typography component={"span"} variant="body1">
                                {date}
                              </Typography>
                            </Box>
                            <Box>
                              {trip.driverName && (
                                <Typography
                                  component={"span"}
                                  variant="body1"
                                  fontWeight={"bold"}
                                >
                                  Autista:{" "}
                                </Typography>
                              )}
                              <Typography component={"span"} variant="body1">
                                {trip.driverName}
                              </Typography>
                            </Box>
                            <Box
                              display={"flex"}
                              justifyContent={"center"}
                              columnGap={theme.spacing(32)}
                              marginTop={theme.spacing(12)}
                            >
                              <Box>
                                <Button
                                  onClick={() => handleEventClick(trip)}
                                  endIcon={<EditIcon />}
                                  sx={{
                                    backgroundColor: "#F3C623",
                                    color: "#fff",
                                    padding: `${theme.spacing(
                                      6
                                    )} ${theme.spacing(12)}`,
                                    borderRadius: theme.spacing(12),
                                  }}
                                >
                                  Modifica
                                </Button>
                              </Box>
                              <Box>
                                <Button
                                  onClick={() =>
                                    handleDeleteTrip(trip.id, trip.date)
                                  }
                                  endIcon={<DeleteIcon />}
                                  sx={{
                                    backgroundColor: "#B8001F",
                                    color: "#fff",
                                    padding: `${theme.spacing(
                                      6
                                    )} ${theme.spacing(12)}`,
                                    borderRadius: theme.spacing(12),
                                  }}
                                >
                                  Elimina
                                </Button>
                              </Box>
                            </Box>
                          </Box>
                        </ListItem>
                        {index < dayTrips.length - 1 && (
                          <Divider variant="middle" component="li" flexItem />
                        )}
                      </>
                    );
                  })}
                </List>
              </Box>
            </Paper>
          </>
        ) : null}
        <Box></Box>
      </Box>
      <Modal
        className={isMobile ? styles.mobileModal : styles.modal}
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
                  value={titleEventInModal}
                  onChange={(event) =>
                    setTitleEventInModal(event?.target?.value)
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
                    value={dateEventInModal}
                    onChange={(date) =>
                      date ? setDateEventInModal(date) : null
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
                  value={vehicleEventInModal}
                  label="Veicolo"
                  onChange={(event) =>
                    setVehicleEventInModal(event?.target?.value)
                  }
                >
                  {vehicles.length > 0 ? (
                    vehicles.map((vehicle, index) => (
                      <MenuItem key={index} value={vehicle.name}>
                        {vehicle.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value={""}>
                      {"Nessun veicolo selezionabile"}
                    </MenuItem>
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
                  value={driverEventInModal}
                  label="Autista"
                  onChange={(event) =>
                    setDriverEventInModal(event?.target?.value)
                  }
                >
                  {drivers.length > 0 ? (
                    drivers.map((driver, index) => (
                      <MenuItem key={index} value={driver.name}>
                        {driver.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value={""}>
                      {"Nessun autista selezionabile"}
                    </MenuItem>
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
            {!isMobile && (
              <>
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
                    onClick={() => handleDeleteTrip(null, null)}
                  >
                    Elimina viaggio
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Calendar;
