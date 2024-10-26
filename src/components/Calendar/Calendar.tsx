import FullCalendar from "@fullcalendar/react";
import {
  Backdrop,
  Box,
  CircularProgress,
  Paper,
  Snackbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import * as React from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";
import itLocale from "@fullcalendar/core/locales/it";
import interactionPlugin from "@fullcalendar/interaction";
import theme from "@/theme/theme";
import "dayjs/locale/it";
import dayjs from "dayjs";
import DailyTripsPaper from "../DailyTripsPaper/DailyTripsPaper";
import TripModal from "../TripModal/TripModal";
import styles from "./Calendar.module.scss";

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
  const [translateY, setTranslateY] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  useEffect(() => {
    fetchTrips();
    fetchVehicles();
    fetchDrivers();
  }, []);

  const fetchTrips = async () => {
    setIsLoading(true);
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
      setIsLoading(false);
      return formattedEvents;
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
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
    setIsLoading(true);
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
        setSnackbarOpen(true);
      } else {
        const errorData = await response.json();
        alert(`Errore nella modifica del viaggio: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Errore nella chiamata PUT:", error);
      alert("Errore durante la modifica del viaggio. Riprova più tardi.");
    }
    setIsLoading(false);
  };

  const handleDeleteTrip = async (id: any) => {
    const conferma = confirm("Sei sicuro di voler eliminare questo viaggio?");
    if (!conferma) return;

    try {
      const response = await fetch(`/api/trips/${idEventInModal}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchTrips();
        if (isMobile) {
          let info = {
            date: actualDay,
          };
          handleCellClick(info);
        }
        setModalOpen(false);
        setSnackbarOpen(true);
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

  const handleCellClick = (info: any) => {
    setActualDay(info.date);
    getDayTrips(info.date);
    setTranslateY(0);
    if (isMobile) {
      setShowTripList(true);
    }
  };

  const renderEventContent = (eventInfo: any) => {
    return (
      <Box className={styles.eventContent}>
        <Typography variant="h6" component={"p"} color="#fff !important">
          {eventInfo.timeText.includes(":")
            ? eventInfo.timeText
            : eventInfo.timeText + ":00"}
        </Typography>
        <Typography variant="body1" component={"p"} color="#fff !important">
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
          <Box className={styles.dayNumber}>
            <Typography component={"span"}>{info.dayNumberText}</Typography>
          </Box>
          {eventCount > 0 && (
            <Box className={styles.eventCount}>
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

  useEffect(() => {
    if (dayTrips.length == 0) {
      setShowTripList(false);
    }
  }, [dayTrips]);

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

  const updateShowTripList = (value: boolean) => {
    setShowTripList(value);
  };

  return isLoading ? (
    <CircularProgress
      sx={{
        marginLeft: isMobile ? "45%" : "50%",
        marginTop: isMobile ? "50%" : "30%",
      }}
    />
  ) : (
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
            height={isMobile ? theme.spacing(459) : "auto"}
            contentHeight={500}
            fixedWeekCount={false}
          />
        </Box>
        {showTripList && (
          <Box
            className={styles.backdropPaper}
            onClick={() => {
              setTranslateY(300);
              setTimeout(() => {
                setShowTripList(false);
              }, 400);
            }}
          />
        )}
        {showTripList ? (
          <DailyTripsPaper
            dayTrips={dayTrips}
            updateShowTripList={updateShowTripList}
            handleEventClick={handleEventClick}
          />
        ) : null}
        <Box></Box>
      </Box>
      <Backdrop
        sx={{ zIndex: 1 }}
        open={modalOpen}
        onClick={() => setModalOpen(false)}
      />
      <TripModal
        modalOpen={modalOpen}
        handleCloseModal={handleCloseModal}
        vehicles={vehicles}
        drivers={drivers}
        handleSaveTrip={handleSaveTrip}
        handleDeleteTrip={handleDeleteTrip}
        titleEventInModal={titleEventInModal}
        dateEventInModal={dateEventInModal}
        vehicleEventInModal={vehicleEventInModal}
        driverEventInModal={driverEventInModal}
        setTitleEventInModal={setTitleEventInModal}
        setDateEventInModal={setDateEventInModal}
        setVehicleEventInModal={setVehicleEventInModal}
        setDriverEventInModal={setDriverEventInModal}
      />
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
    </>
  );
};

export default Calendar;
