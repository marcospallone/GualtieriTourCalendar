import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../theme/theme";
import { AppProps } from "next/app";
import Layout from "@/components/Layout";
import '../styles/global.scss';
import { useEffect } from "react";
import OneSignal from "react-onesignal";

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    OneSignal.init({
      appId: '52ba47df-9457-4f9d-b8cd-9c25fff35a96',
      notifyButton: {
        enable: false,
      },
      autoresubscribe: true,
      allowLocalhostAsSecureOrigin: true,
      
    });
    OneSignal.Notifications.requestPermission().then((permission:any) => {
      if (permission === 'granted') {
      } else {
      }
    });
  }, []);
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}
