import theme from "@/theme/theme";
import {
  Modal,
  Box,
  IconButton,
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Typography,
  useMediaQuery,
} from "@mui/material";
import * as React from "react";
import styles from "./ServiceModal.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { itIT } from "@mui/x-date-pickers/locales";

interface ServiceModalProps {
  modalOpen: boolean;
  handleCloseModal: any;
  drivers: any[];
  handleSaveService: any;
  handleDeleteService: any;
  dateServiceInModal: any;
  driverServiceInModal: string;
  activityServiceInModal: any;
  setDateServiceInModal: (date: any) => void;
  setDriverServiceInModal: (value: string) => void;
  setActivityServiceInModal: (activity: any) => void;
}

const ServiceModal: React.FC<ServiceModalProps> = ({
  modalOpen,
  handleCloseModal,
  drivers,
  handleSaveService: handleSaveService,
  handleDeleteService: handleDeleteService,
  dateServiceInModal: dateServiceInModal,
  driverServiceInModal: driverServiceInModal,
  activityServiceInModal: activityServiceInModal,
  setDateServiceInModal: setDateServiceInModal,
  setDriverServiceInModal: setDriverServiceInModal,
  setActivityServiceInModal: setActivityServiceInModal,
}) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <Modal
      className={isMobile ? styles.mobileModal : styles.modal}
      open={modalOpen}
      onClose={handleCloseModal}
      hideBackdrop
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        className={styles.modalBox}
      >
        <Box
          display={"flex"}
          justifyContent={"flex-end"}
          marginBottom={theme.spacing(16)}
          marginTop={isMobile ? theme.spacing(16) : 0}
        >
          <IconButton
            className={styles.closeModalButton}
            onClick={handleCloseModal}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          rowGap={theme.spacing(12)}
        >
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
                  value={dateServiceInModal}
                  onChange={(date) => (date ? setDateServiceInModal(date) : null)}
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
              <InputLabel id="select-driver-label">Autista</InputLabel>
              <Select
                labelId="select-driver-label"
                id="select-driver-label"
                value={driverServiceInModal}
                label="Autista"
                onChange={(event) =>
                  setDriverServiceInModal(event?.target?.value)
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
          <Box>
            <FormControl fullWidth>
              <TextField
                label="Attività"
                variant="outlined"
                value={activityServiceInModal}
                onChange={(event) =>
                  setActivityServiceInModal(event?.target?.value)
                }
              />
            </FormControl>
          </Box>
          <Box textAlign={"center"}>
            <Button
              className={styles.saveService}
              startIcon={<DoneIcon />}
              onClick={handleSaveService}
            >
              Salva
            </Button>
          </Box>

          <Box>
            <Divider textAlign="center">
              <Typography
                variant="body1"
                component="span"
                padding={theme.spacing(16)}
              >
                oppure
              </Typography>
            </Divider>
          </Box>
          <Box textAlign={"center"}>
            <Button
              className={styles.deleteService}
              startIcon={<DeleteIcon />}
              onClick={() => handleDeleteService(null)}
            >
              Elimina servizio
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default ServiceModal;
