import { Box, Button } from "@mui/material";
import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import theme from "@/theme/theme";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { authGuard } from "@/services/authGuard";
import ServicesTable from "@/components/ServicesTable/ServicesTable";

const Services: React.FC = () => {
  const router = useRouter();

  const handleNewServiceClick = () => {
    router.push("/addService");
  };
  return (
    <Box className={"main-box"}>
      <Box paddingTop={theme.spacing(12)}
      >
        <Button
          sx={{
            backgroundColor: "#018749",
            color: "#fff",
            padding: `${theme.spacing(6)} ${theme.spacing(12)}`,
            borderRadius: theme.spacing(12),
          }}
          startIcon={<AddIcon />}
          onClick={handleNewServiceClick}
        >
          Nuovo Servizio
        </Button>
      </Box>
      <ServicesTable></ServicesTable>
    </Box>
  );
};

export default Services;

export const getServerSideProps: GetServerSideProps = async (context) => {
  return authGuard(context);
};