import FullCalendar from "@fullcalendar/react";
import { Box } from "@mui/material";
import * as React from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";

interface Trip {
  id: number;
  date: string;
  tripTitle: string;
  vehicleName: any;
}

const Calendar: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);

  useEffect(() => {
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
    fetchTrips();
  }, []);


  return (
    <Box>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={trips}
      />
    </Box>
  );
};

export default Calendar;
