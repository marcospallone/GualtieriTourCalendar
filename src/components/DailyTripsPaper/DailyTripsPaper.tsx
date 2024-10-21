import * as React from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";
import theme from "@/theme/theme";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import styles from "./DailyTripsPaper.module.scss";

interface DailyTripsPaperProps {
  dayTrips: any[];
  updateShowTripList: any;
  handleEventClick: any;
}

const DailyTripsPaper: React.FC<DailyTripsPaperProps> = ({
  dayTrips,
  updateShowTripList,
  handleEventClick,
}) => {
  const [translateY, setTranslateY] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
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
      setTranslateY(400);
      setTimeout(() => updateShowTripList(false), 300);
    } else {
      setTranslateY(0);
    }
  };

  return (
    <Paper
      className={styles.tripPaper}
      sx={{
        transform: `translateY(${translateY}px)`,
        transition: isSwiping ? "none" : "transform 0.5s ease-out",
      }}
      elevation={24}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Box display={"flex"} justifyContent={"flex-end"}>
        <IconButton
          className={styles.closePaper}
          onClick={() => {
            setTranslateY(400);
            setTimeout(() => updateShowTripList(false), 300);
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box>
        <List disablePadding>
          {dayTrips.map((trip: any, index: any) => {
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
                      <Typography
                        component={"span"}
                        variant="body1"
                        fontWeight={"bold"}
                      >
                        Autista:{" "}
                      </Typography>
                      <Typography component={"span"} variant="body1">
                        {trip.driverName || "-"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        component={"span"}
                        variant="body1"
                        fontWeight={"bold"}
                      >
                        Veicolo:{" "}
                      </Typography>
                      <Typography component={"span"} variant="body1">
                        {trip.vehicleName || "-"}
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
                          className={styles.editTrip}
                          onClick={() => handleEventClick(trip)}
                          endIcon={<EditIcon />}
                        >
                          Modifica
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </ListItem>
                {index < dayTrips.length - 1 && (
                  <Divider
                    className={styles.paperDivider}
                    variant="middle"
                    component="li"
                    flexItem
                  />
                )}
              </>
            );
          })}
        </List>
      </Box>
    </Paper>
  );
};

export default DailyTripsPaper;