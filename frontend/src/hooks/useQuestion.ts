import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";

export function useQuestion(sessionActive: boolean, isModalTopicOpen: boolean) {
  const [question, setQuestion] = useState("");
  const [questionPresented, setQuestionPresented] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchQuestion = useCallback(async () => {
    if (!sessionActive || isModalTopicOpen) return;
    setIsLoading(true);

    const isSamsungBrowser = /samsungbrowser/i.test(navigator.userAgent);

    const baseUrl = import.meta.env.VITE_BASE_AXIOS_URL;
    const sessionKey = localStorage.getItem("session_key");
    const questionTopic = localStorage.getItem("question_topic");
    const endpoint = isSamsungBrowser
      ? `${baseUrl}/chat/samsung/${sessionKey}/${questionTopic}`
      : `${baseUrl}/chat/${questionTopic}`;

    try {
      const response = await axios.get(endpoint, { withCredentials: true });
      localStorage.setItem("question_id", response.data.id);
      setQuestion(response.data.question);
      setQuestionPresented(new Date().toISOString());
    } catch (e) {
      if (!(e instanceof AxiosError)) return;
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }, [sessionActive, isModalTopicOpen]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  return { question, questionPresented, isLoading, error, fetchQuestion };
}
