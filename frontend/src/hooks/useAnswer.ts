import axios, { AxiosError } from "axios";
import { useState } from "react";

type KeyPresses = {
  [key: string]: number;
};

type AnswerRequest = {
  backspace_count: number;
  letter_click_counts: KeyPresses;
  typing_duration: number;
  question_presented_at: string;
  answer_submitted_at: string;
  total_interaction_time: number;
  response_type: string;
  device_type: string;
  session_key?: string;
};

export function useAnswer() {
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const sendAnswer = async (metadata: AnswerRequest) => {
    setIsLoading(true);

    const isSamsungBrowser = /samsungbrowser/i.test(navigator.userAgent);

    const baseUrl = import.meta.env.VITE_BASE_AXIOS_URL;
    const sessionKey = localStorage.getItem("session_key");
    const endpoint = isSamsungBrowser
      ? `${baseUrl}/chat/samsung/${sessionKey}`
      : `${baseUrl}/chat`;

    const requestBody = {
      question_id: localStorage.getItem("question_id"),
      answer_text: answer,
      ...metadata
    };

    if (isSamsungBrowser) {
      requestBody.session_key =
        localStorage.getItem("session_key") ?? undefined;
    }

    try {
      await axios.post(endpoint, requestBody, { withCredentials: true });
      setAnswer("");
    } catch (e) {
      if (!(e instanceof AxiosError)) return;
      setError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return { answer, setAnswer, sendAnswer, isLoading, error };
}
