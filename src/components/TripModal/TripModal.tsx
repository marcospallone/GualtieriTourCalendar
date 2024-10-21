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
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { itIT } from "@mui/x-date-pickers/locales";
import * as React from "react";
import styles from "./TripModal.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneIcon from "@mui/icons-material/Done";

interface TripModalProps {
  modalOpen: boolean;
  handleCloseModal: any;
  vehicles: any[];
  drivers: any[];
  handleSaveTrip: any;
  handleDeleteTrip: any;
  titleEventInModal: string;
  dateEventInModal: any;
  vehicleEventInModal: string;
  driverEventInModal: string;
  setTitleEventInModal: (value: string) => void;
  setDateEventInModal: (date: any) => void;
  setVehicleEventInModal: (value: string) => void;
  setDriverEventInModal: (value: string) => void;
}

const TripModal: React.FC<TripModalProps> = ({
  modalOpen,
  handleCloseModal,
  vehicles,
  drivers,
  handleSaveTrip,
  handleDeleteTrip,
  titleEventInModal,
  dateEventInModal,
  vehicleEventInModal,
  driverEventInModal,
  setTitleEventInModal,
  setDateEventInModal,
  setVehicleEventInModal,
  setDriverEventInModal,
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
              <TextField
                label="Descrizione"
                variant="outlined"
                value={titleEventInModal}
                onChange={(event) => setTitleEventInModal(event?.target?.value)}
              />
            </FormControl>
          </Box>
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
                  value={dateEventInModal}
                  onChange={(date) => (date ? setDateEventInModal(date) : null)}
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
              <InputLabel id="select-vehicle-label">Veicolo</InputLabel>
              <Select
                labelId="select-vehicle-label"
                id="select-vehicle-label"
                value={vehicleEventInModal}
                label="Veicolo"
                onChange={(event) =>
                  setVehicleEventInModal(event?.target?.value)
                }
              >
                {vehicles.length > 0 ? (
                  vehicles.map((vehicle, index) => (
                    <MenuItem key={index} value={vehicle.name}>
                      {vehicle.name}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value={""}>
                    {"Nessun veicolo selezionabile"}
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>
          <Box>
            <FormControl fullWidth>
              <InputLabel id="select-driver-label">Autista</InputLabel>
              <Select
                labelId="select-driver-label"
                id="select-driver-label"
                value={driverEventInModal}
                label="Autista"
                onChange={(event) =>
                  setDriverEventInModal(event?.target?.value)
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
            <Button
              className={styles.saveTrip}
              startIcon={<DoneIcon />}
              onClick={handleSaveTrip}
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
          <Box>
            <Button
              className={styles.deleteTrip}
              startIcon={<DeleteIcon />}
              onClick={() => handleDeleteTrip(null)}
            >
              Elimina viaggio
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default TripModal;
