import FullCalendar from "@fullcalendar/react";
import {
  Box,
  Button,
  Fade,
  IconButton,
  List,
  ListItem,
  Modal,
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

interface Trip {
  id: number;
  date: string;
  tripTitle: string;
  vehicleName: string;
  driverName: string;
}

const Calendar: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [dayTrips, setDayTrips] = useState<any[]>([]);
  const [showTripList, setShowTripList] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [eventInModal, setEventInModal] = useState<any>({});

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  useEffect(() => {
    fetchTrips();
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
    const date = `${formattedDay} - ${formattedTime}`;
    let event = {
      title: info.event.title,
      date: date,
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
              <Typography>{eventInModal?.title}</Typography>
              <Typography>{eventInModal?.date}</Typography>
              <Typography>{eventInModal?.driverName}</Typography>
              <Typography>{eventInModal?.vehicleName}</Typography>
            </Box>
          </Box>
        </Modal>
    </>
  );
};

export default Calendar;
