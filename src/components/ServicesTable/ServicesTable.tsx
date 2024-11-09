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
import styles from "./ServicesTable.module.scss";
import ServiceModal from "../ServiceModal/ServiceModal";

interface Service {
    id:any;
    driver:string;
    activity:string;
}

interface Driver {
    id:any;
    name:string;
}

const ServicesTable: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [dayServices, setDayServices] = useState<any[]>([]);
  const [showServiceList, setShowServiceList] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [idServiceInModal, setIdServiceInModal] = useState<any>({});
  const [driverServiceInModal, setDriverServiceInModal] = useState<any>({});
  const [activityServiceInModal, setActivityServiceInModal] = useState<any>();
  const [drivers, setDrivers] = useState<any[]>([]);
  const [actualDay, setActualDay] = useState<any>();
  const [translateY, setTranslateY] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  useEffect(() => {
    fetchServices();
    fetchDrivers();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/services");
      if (!response.ok) {
        throw new Error("Errore durante il recupero dei servizi");
      }
      const data: Service[] = await response.json();
      const formattedServices = data.map((service) => ({
        id: service.id.toString(),
        driver: service.driver,
        activity: service.activity,
      }));
      setServices(formattedServices);
      setIsLoading(false);
      return formattedServices;
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const date = actualDay || new Date();
    getDayServices(date);
  }, [services]);

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

  const handleSaveService = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/services/${idServiceInModal}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            driver: driverServiceInModal,
          activity: activityServiceInModal
        }),
      });

      if (response.ok) {
        await fetchServices();
        setModalOpen(false);
        setSnackbarOpen(true);
      } else {
        const errorData = await response.json();
        alert(`Errore nella modifica del servizio: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Errore nella chiamata PUT:", error);
      alert("Errore durante la modifica del servizio. Riprova più tardi.");
    }
    setIsLoading(false);
  };

  const handleDeleteService = async (id: any) => {
    const conferma = confirm("Sei sicuro di voler eliminare questo servizio?");
    if (!conferma) return;

    try {
      const response = await fetch(`/api/services/${idServiceInModal}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchServices();
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
        alert(`Errore nell'eliminazione del servizio: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Errore nella chiamata DELETE:", error);
      alert("Errore durante l'eliminazione del servizio. Riprova più tardi.");
    }
  };

  const getDayServices = (date: any) => {
    const validDate = new Date(date);
    const dateStr = new Intl.DateTimeFormat("it-IT", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(validDate);
    if (isMobile) {
      const servicesOnDay = services.filter((service) => {
        const serviceDateStr = new Intl.DateTimeFormat("it-IT", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date(service.start));
        return serviceDateStr === dateStr;
      });
      setDayServices(servicesOnDay);
    }
  };

  const handleCellClick = (info: any) => {
    setActualDay(info.date);
    getDayServices(info.date);
    setTranslateY(0);
    if (isMobile) {
      setShowServiceList(true);
    }
  };

  const renderServiceContent = (serviceInfo: any) => {
    return (
      <Box className={styles.serviceContent}>
        <Typography variant="h6" component={"p"} color="#fff !important">
          {serviceInfo.timeText.includes(":")
            ? serviceInfo.timeText
            : serviceInfo.timeText + ":00"}
        </Typography>
        <Typography variant="body1" component={"p"} color="#fff !important">
          {serviceInfo.event.title}
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
      const servicesOnDay = services.filter((service) => {
        const serviceDateStr = new Intl.DateTimeFormat("it-IT", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(new Date(service.start));
        return serviceDateStr === dateStr;
      });
      const serviceCount = servicesOnDay.length;

      return (
        <Box>
          <Box className={styles.dayNumber}>
            <Typography component={"span"}>{info.dayNumberText}</Typography>
          </Box>
          {serviceCount > 0 && (
            <Box className={styles.serviceCount}>
              <Typography
                variant="button"
                component={"span"}
                fontWeight={"bold"}
              >
                {serviceCount}
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
    if (dayServices.length == 0) {
      setShowServiceList(false);
    }
  }, [dayServices]);

  const handleServiceClick = (info: any) => {
    if (isMobile) {
      setIdServiceInModal(info.id);
      setDriverServiceInModal(info.title);
      setActivityServiceInModal(dayjs(info.start));
      setActualDay(info.start);
    } else {
      setIdServiceInModal(info.event.id);
      setDriverServiceInModal(info.event.title);
      setActivityServiceInModal(dayjs(info.event.start));
      setActualDay(info.event.start);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const updateShowServiceList = (value: boolean) => {
    setShowServiceList(value);
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
            events={services}
            dateClick={handleCellClick}
            eventClick={handleServiceClick}
            eventContent={renderServiceContent}
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
        {showServiceList && (
          <Box
            className={styles.backdropPaper}
            onClick={() => {
              setTranslateY(300);
              setTimeout(() => {
                setShowServiceList(false);
              }, 400);
            }}
          />
        )}
        {showServiceList ? (
          <DailyTripsPaper
            dayTrips={dayServices}
            updateShowTripList={updateShowServiceList}
            handleEventClick={handleServiceClick}
          />
        ) : null}
        <Box></Box>
      </Box>
      <Backdrop
        sx={{ zIndex: 1 }}
        open={modalOpen}
        onClick={() => setModalOpen(false)}
      />
      <ServiceModal
        modalOpen={modalOpen}
        handleCloseModal={handleCloseModal}
        drivers={drivers}
        handleSaveService={handleSaveService}
        handleDeleteService={handleDeleteService}
        driverServiceInModal={driverServiceInModal}
        activityServiceInModal={activityServiceInModal}
        setDriverServiceInModal={setDriverServiceInModal}
        setActivityServiceInModal={setActivityServiceInModal}
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

export default ServicesTable;
