import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/login.module.scss";
import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import KeyIcon from "@mui/icons-material/Key";
import theme from "@/theme/theme";
import Logo from "@/components/Logo";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      router.push("/");
    } else {
      const data = await response.json();
      setError(data.error);
    }
  };

  return (
    <Box className={styles.login}>
      {!isMobile && (
        <Box
        className={styles.loginLogo}
          display={"flex"}
          sx={{ cursor: "pointer", justifyContent: 'center' }}
        >
          <Logo />
        </Box>
      )}
      {error && (
        <Typography variant="body1" component={"p"} style={{ color: "red" }}>
          {error}
        </Typography>
      )}
      <form onSubmit={handleSubmit}>
        <Box>
          <TextField
            className={styles.loginInput}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              },
            }}
            placeholder="Username"
          />
        </Box>

        <Box>
          <TextField
            className={styles.loginInput}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyIcon />
                  </InputAdornment>
                ),
              },
            }}
            placeholder="Password"
          />
        </Box>
        <Box className={styles.loginSubmit}>
          <Button type="submit">Login</Button>
        </Box>
      </form>
    </Box>
  );
};

export default Login;
