import { Box, Button } from "@mui/material";
import * as React from "react";
import Calendar from "@/components/Calendar/Calendar";
import AddIcon from "@mui/icons-material/Add";
import theme from "@/theme/theme";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

const Home: React.FC = () => {
  const router = useRouter();
  const handleNewTripClick = () => {
    router.push("/addTrip");
  };
  return (
    <Box className={"main-box"}>
      <Box paddingTop={theme.spacing(12)}
      >
        <Button
          sx={{
            backgroundColor: "#EB8317",
            color: "#fff",
            padding: `${theme.spacing(6)} ${theme.spacing(12)}`,
            borderRadius: theme.spacing(12),
          }}
          startIcon={<AddIcon />}
          onClick={handleNewTripClick}
        >
          Nuovo Viaggio
        </Button>
      </Box>
      <Calendar></Calendar>
    </Box>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { req } = context;
  const cookies = req.headers.cookie || "";

  if (!cookies.includes("auth=true")) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
