import FullCalendar from "@fullcalendar/react";
import { Box, Button } from "@mui/material";
import * as React from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import Calendar from "@/components/Calendar/Calendar";
import AddIcon from "@mui/icons-material/Add";
import theme from "@/theme/theme";
import { useRouter } from "next/router";

const Home: React.FC = () => {
    const router = useRouter();
    const handleNewTripClick = () => {router.push('/addTrip')}
  return (
    <Box className={"main-box"}>
      <Box
        sx={{
          width: "fit-content",
          borderRadius: theme.spacing(12),
          backgroundColor: "red",
          padding: `${theme.spacing(10)} ${theme.spacing(16)}`,
        }}
      >
        <Button sx={{ color: "#fff" }} startIcon={<AddIcon />} onClick={handleNewTripClick}>
          Nuovo Viaggio
        </Button>
      </Box>
      <Calendar></Calendar>
    </Box>
  );
};

export default Home;
