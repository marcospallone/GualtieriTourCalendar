import * as React from "react";
import { Box } from "@mui/material";
import { useRouter } from "next/router";

function Logo() {
  const router = useRouter();
  return (
    <Box sx={{ textAlign: "center" }}>
      <Box
        display={"flex"}
        sx={{ cursor: "pointer", justifyContent: 'center' }}
        onClick={() => router.push("/")}
      >
        <img src={"/images/LogoGT.png"} alt="Gualtieri Tour Logo" />
      </Box>
    </Box>
  );
}

export default Logo;
