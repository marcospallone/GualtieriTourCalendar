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
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import styles from "./DailyEventsPaper.module.scss";

interface DailyEventsPaperProps {
  dayEvents: any[];
  updateShowEventList: any;
  handleEventClick: any;
  isServices: boolean;
}

const DailyEventsPaper: React.FC<DailyEventsPaperProps> = ({
  dayEvents: dayEvents,
  updateShowEventList: updateShowEventList,
  handleEventClick,
  isServices,
}) => {
  return (
    <Paper className={styles.eventPaper} elevation={24}>
      <Box display={"flex"} justifyContent={"flex-end"}>
        <IconButton
          className={styles.closePaper}
          onClick={() => {
            setTimeout(() => updateShowEventList(false), 300);
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box>
        <List disablePadding>
          {dayEvents.map((event: any, index: any) => {
            const validDate = isServices
              ? new Date(event.date)
              : new Date(event.start);
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
                        {event.title}
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
                        {isServices ? event.driver : event.driverName || "-"}
                      </Typography>
                    </Box>
                    {!isServices && (
                      <Box>
                        <Typography
                          component={"span"}
                          variant="body1"
                          fontWeight={"bold"}
                        >
                          Veicolo:{" "}
                        </Typography>
                        <Typography component={"span"} variant="body1">
                          {event.vehicleName || "-"}
                        </Typography>
                      </Box>
                    )}
                    {isServices && (
                      <Box>
                        <Typography
                          component={"span"}
                          variant="body1"
                          fontWeight={"bold"}
                        >
                          Attività:{" "}
                        </Typography>
                        <Typography component={"span"} variant="body1">
                          {event.activity || "-"}
                        </Typography>
                      </Box>
                    )}
                    <Box
                      display={"flex"}
                      justifyContent={"center"}
                      columnGap={theme.spacing(32)}
                      marginTop={theme.spacing(12)}
                    >
                      <Box>
                        <Button
                          className={styles.editEvent}
                          onClick={() => handleEventClick(event)}
                          endIcon={<EditIcon />}
                        >
                          Modifica
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </ListItem>
                {index < dayEvents.length - 1 && (
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

export default DailyEventsPaper;
