import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

export function useSession() {
  const [sessionActive, setSessionActive] = useState(false);
  const [isLoadingGetSession, setIsLoadingGetSession] = useState(false);
  const [isLoadingCheckSession, setIsLoadingCheckSession] = useState(false);
  const [errorGetSession, setErrorGetSession] = useState(false);
  const [errorCheckSession, setErrorCheckSession] = useState(false);

  const getSession = async () => {
    const isSamsungBrowser = /samsungbrowser/i.test(navigator.userAgent);

    const baseUrl = import.meta.env.VITE_BASE_AXIOS_URL;
    const sessionKey = localStorage.getItem("session_key");
    const endpoint = isSamsungBrowser
      ? `${baseUrl}/session/samsung/${sessionKey}`
      : `${baseUrl}/session`;

    setIsLoadingGetSession(true);
    try {
      const response = await axios.get(endpoint, { withCredentials: true });
      if (isSamsungBrowser) {
        localStorage.setItem("session_key", response.data.session_key);
      }

      setSessionActive(true);
    } catch (e) {
      if (!(e instanceof AxiosError)) return;
      setErrorGetSession(true);
    } finally {
      setIsLoadingGetSession(false);
    }
  };

  const checkSession = async () => {
    setIsLoadingCheckSession(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_AXIOS_URL}/session-check`,
        { withCredentials: true }
      );

      setSessionActive(response.data.session_active);
    } catch (e) {
      if (!(e instanceof AxiosError)) return;
      setErrorCheckSession(true);
    } finally {
      setIsLoadingCheckSession(false);
    }
  };

  useEffect(() => {
    const isSamsungBrowser = /samsungbrowser/i.test(navigator.userAgent);

    if (isSamsungBrowser) {
      if (localStorage.getItem("session_key")) {
        setSessionActive(true);
      }
    } else {
      checkSession();
    }
  }, []);

  return {
    sessionActive,
    getSession,
    isLoadingGetSession,
    isLoadingCheckSession,
    errorGetSession,
    errorCheckSession
  };
}
