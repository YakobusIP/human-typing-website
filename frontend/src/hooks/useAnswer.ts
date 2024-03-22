import axios, { AxiosError } from "axios";
import { useState } from "react";

type KeyPresses = {
  [key: string]: number;
};

type AnswerRequest = {
  backspace_count: number;
  letter_click_counts: KeyPresses;
  typing_duration: number;
  response_type: string;
};

export function useAnswer() {
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const sendAnswer = async (metadata: AnswerRequest) => {
    setIsLoading(true);

    const baseUrl = import.meta.env.VITE_BASE_AXIOS_URL;
    const endpoint = `${baseUrl}/chat`;

    const requestBody = {
      answer_text: answer,
      ...metadata
    };

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
