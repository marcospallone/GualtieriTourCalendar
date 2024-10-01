import FullCalendar from "@fullcalendar/react";
import { Box } from "@mui/material";
import * as React from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";
import itLocale from "@fullcalendar/core/locales/it";
import interactionPlugin from "@fullcalendar/interaction";

interface Trip {
  id: number;
  date: string;
  tripTitle: string;
  vehicleName: any;
}

const Calendar: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);

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
        title: trip.tripTitle + " - " + trip.vehicleName,
        start: trip.date,
      }));

      setTrips(formattedEvents);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEventClick = (clickInfo: any) => {
    alert(
      `Evento: ${clickInfo.event.title}\nData inizio: ${clickInfo.event.start}`
    );
  };

  const renderEventContent = (eventInfo: any) => {
    console.log(eventInfo)
    return (
      <div>
        <b>{eventInfo.timeText}</b>
        <br />
        <span>{eventInfo.event.title}</span>
      </div>
    );
  };

  return (
    <Box>
      <FullCalendar
        locale={itLocale}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={trips}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
      />
    </Box>
  );
};

export default Calendar;
