import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../theme/theme";
import { AppProps } from "next/app";
import Layout from "@/components/Layout";
import '../styles/global.scss';
import OneSignal from 'react-onesignal';
import { useEffect, useState } from "react";

export default function MyApp({ Component, pageProps }: AppProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    OneSignal.init({
      appId: 'bda99196-df09-44e8-8a96-70aaab7d9a25',
      notifyButton: {
        enable: true,
        hidewhensubscribed: true,
      },
      allowLocalhostAsSecureOrigin: true,
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
