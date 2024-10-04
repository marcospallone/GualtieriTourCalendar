import FullCalendar from "@fullcalendar/react";
import { Box, List, ListItem, Typography, useMediaQuery } from "@mui/material";
import * as React from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useState } from "react";
import itLocale from "@fullcalendar/core/locales/it";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import theme from "@/theme/theme";
import { formatDate } from "@fullcalendar/core";

interface Trip {
  id: number;
  date: string;
  tripTitle: string;
  vehicleName: any;
}

const Calendar: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [dayTrips, setDayTrips] = useState<any[]>([]);
  const [showTripList, setShowTripList] = useState(false);

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
      console.log(data);
      setTrips(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCellClick = (info: any) => {
    const dateStr = info.date.toISOString().split("T")[0];
    if (isMobile) {
      const eventsOnDay = trips.filter((event) =>
        event.date.startsWith(dateStr)
      );
      console.log(eventsOnDay);
      setDayTrips(eventsOnDay);
      setShowTripList(true);
    }
  };

  const renderEventContent = (eventInfo: any) => {
    console.log(eventInfo);
    return (
      <div>
        <b>{eventInfo.timeText}</b>
        <br />
        <b>OK</b>
        <span>{eventInfo.event.title}</span>
      </div>
    );
  };

  const handleCellContent = (info: any) => {
    const dateStr = info.date.toISOString().split("T")[0];
    const eventsOnDay = trips.filter((event) => event.date.startsWith(dateStr));
    const eventCount =
      eventsOnDay.length > 0 ? `${eventsOnDay.length} eventi` : "";

    return (
      <div>
        <div>{info.dayNumberText}</div>
        {eventCount && (
          <div
            className="event-count"
            style={{ fontSize: "0.8em", color: "#ff5722" }}
          >
            {eventCount}
          </div>
        )}
      </div>
    );
  };

  return (
    <Box>
      <Box>
        <FullCalendar
          locale={itLocale}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={trips}
          dateClick={handleCellClick}
          // eventClick={handleEventClick}
          eventContent={renderEventContent}
          dayCellContent={isMobile && handleCellContent}
          eventDisplay={isMobile ? "none" : undefined}
        />
      </Box>
      {showTripList && (
        <List>
          {dayTrips.map((trip, index) => {
            const validDate = new Date(trip.date);
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
              <ListItem>
                <Box>
                  <Box>
                    <Typography>{trip.tripTitle}</Typography>
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
  );
};

export default Calendar;
