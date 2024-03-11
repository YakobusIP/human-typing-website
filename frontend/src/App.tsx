/* eslint-disable react-hooks/exhaustive-deps */
import { BaseSyntheticEvent, useEffect, useState } from "react";
import {
  Button,
  Divider,
  Flex,
  HStack,
  Spinner,
  Stack,
  Text,
  Textarea,
  VStack,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import TypingEffect from "@/components/TypingText";
import { useSession } from "./hooks/useSession";
import { ModalAgree } from "./components/ModalAgree";
import { InformationPanel } from "./components/InformationPanel";
import { useQuestion } from "./hooks/useQuestion";
import { Navbar } from "./components/Navbar";
import { useAnswer } from "./hooks/useAnswer";
import { ModalTopic } from "./components/ModalTopic";

type KeyPresses = {
  [key: string]: number;
};

function App() {
  const initializeKeyPressDict = () => {
    const alphabets = "abcdefghijklmnopqrstuvwxyz".split("");
    const keyPress: KeyPresses = {};
    alphabets.forEach((letter) => (keyPress[letter] = 0));
    return keyPress;
  };

  const toast = useToast({ position: "top-right" });

  const [isModalTopicOpen, setModalTopicOpen] = useState(false);

  // Custom hooks
  const {
    sessionActive,
    getSession,
    isLoadingGetSession,
    isLoadingCheckSession,
    errorGetSession,
    errorCheckSession
  } = useSession();

  const {
    question,
    questionPresented,
    isLoading: loadingQuestion,
    error: errorQuestion,
    fetchQuestion
  } = useQuestion(sessionActive, isModalTopicOpen);

  const {
    answer,
    setAnswer,
    sendAnswer,
    isLoading: loadingAnswer,
    error: errorAnswer
  } = useAnswer();

  const { onClose: onAgreeModalClose } = useDisclosure();
  const { onClose: onTopicModalClose } = useDisclosure();

  // Typing metrics state
  const [keyPresses, setKeyPresses] = useState(initializeKeyPressDict());
  const [lastAnswer, setLastAnswer] = useState("");
  const [backspaceCount, setBackspaceCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [source, setSource] = useState<string>();
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleAgree = async () => {
    await getSession();
    setModalTopicOpen(true);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const key = event.key.toLowerCase();
    if (key === "backspace") {
      setBackspaceCount(backspaceCount + 1);
    } else if (key.length === 1 && key.match(/[a-z]/i)) {
      setKeyPresses((prevKeyPresses: KeyPresses) => ({
        ...prevKeyPresses,
        [key]: (prevKeyPresses[key] || 0) + 1
      }));
    }
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newAnswer = event.target.value;
    setAnswer(newAnswer);

    const userAgent = navigator.userAgent;

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );
    const isTablet =
      /iPad|Android/i.test(userAgent) && !/Mobile/i.test(userAgent);

    if (isMobile || isTablet) {
      if (newAnswer.length < lastAnswer.length) {
        setBackspaceCount(backspaceCount + 1);
      } else {
        const addedText = newAnswer.replace(lastAnswer, "");
        if (addedText.match(/^[A-Za-z]+$/)) {
          setKeyPresses((prevKeyPresses: KeyPresses) => ({
            ...prevKeyPresses,
            [addedText.toLowerCase()]:
              (prevKeyPresses[addedText.toLowerCase()] || 0) + 1
          }));
        }
      }
    }

    setLastAnswer(newAnswer);
  };

  const handleBlur = () => {
    if (isTyping) {
      const endTime = Date.now();
      const currentDuration = Math.round((endTime - startTime) / 1000);
      setDuration((duration) => duration + currentDuration);
      setIsTyping(false); // Pause typing
    }
  };

  const handleFocus = () => {
    if (!isTyping) {
      setStartTime(Date.now());
      setIsTyping(true);
    }
  };

  const handleCopyPaste = (event: BaseSyntheticEvent) => {
    event.preventDefault();
    toast({
      title: "Action not allowed",
      description: "Copy paste is disabled",
      status: "info"
    });
  };

  const handleSubmit = async () => {
    const userAgent = navigator.userAgent;

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );
    const isTablet =
      /iPad|Android/i.test(userAgent) && !/Mobile/i.test(userAgent);

    const calculateTotalInteractionTime = (questionPresented: string) => {
      return Math.round(
        (Date.now() - new Date(questionPresented).getTime()) / 1000
      );
    };

    const responseTypeMapping = (source: string | undefined) => {
      switch (source) {
        case "personal-answer":
          return "PERSONAL";
        case "ai-paraphrase":
          return "AI_PARAPHRASE";
        case "fully-ai":
          return "FULLY_AI";
        default:
          return "";
      }
    };

    await sendAnswer({
      backspace_count: backspaceCount,
      letter_click_counts: keyPresses,
      typing_duration: duration,
      question_presented_at: questionPresented,
      answer_submitted_at: new Date().toISOString(),
      total_interaction_time: calculateTotalInteractionTime(questionPresented),
      response_type: responseTypeMapping(source),
      device_type: isMobile ? "MOBILE" : isTablet ? "TABLET" : "DESKTOP"
    });

    await fetchQuestion();
  };

  useEffect(() => {
    if (!localStorage.getItem("question_topic")) {
      setModalTopicOpen(true);
    }
  }, []);

  useEffect(() => {
    if (errorCheckSession || errorGetSession || errorAnswer || errorQuestion) {
      toast({
        title: "Error",
        description: "Internal server error",
        status: "error"
      });
    }
  }, [errorCheckSession, errorGetSession, errorAnswer, errorQuestion]);

  useEffect(() => {
    if (answer.length > 0 && !isTyping) {
      setIsTyping(true);
      setStartTime(Date.now());
    }
  }, [answer, isTyping]);

  return (
    <>
      <VStack bgColor={"main"} position={"relative"} minH={"100vh"}>
        <Navbar />
        {isLoadingCheckSession ? (
          <Flex
            grow={1}
            w={"full"}
            alignItems={"center"}
            justifyContent={"center"}
            direction={"column"}
            rowGap={4}
          >
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size={"xl"}
            />
            <Text fontSize={20}>Loading... Please wait</Text>
          </Flex>
        ) : (
          <Flex
            grow={1}
            w={"full"}
            alignItems={"center"}
            direction={"column"}
            p={8}
          >
            <VStack
              spacing={{ base: 8, lg: 8 }}
              w={{ base: "full", lg: "60%" }}
            >
              <InformationPanel />
              <Divider />
              <VStack w={"full"} spacing={4}>
                <Text fontSize={18}>
                  Silahkan jawab pertanyaan wawancara dari seorang HRD di bawah
                  ini, asumsikan bahwa Anda adalah seorang kandidat:
                </Text>
                {loadingQuestion ? (
                  <HStack>
                    <Spinner
                      thickness="4px"
                      speed="0.65s"
                      emptyColor="gray.200"
                      color="blue.500"
                    />
                    <Text fontSize={20}>Generating question...</Text>
                  </HStack>
                ) : (
                  <TypingEffect text={question} />
                )}

                <Textarea
                  value={answer}
                  rows={5}
                  width={"full"}
                  placeholder="Silahkan jawab disini"
                  resize={"none"}
                  onChange={handleOnChange}
                  onKeyDown={handleKeyPress}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                  onCopy={handleCopyPaste}
                  onPaste={handleCopyPaste}
                />
                <Text fontSize={18}>
                  Silahkan pilih salah satu sumber jawaban
                </Text>
                <Stack
                  direction={{ base: "column", "2xl": "row" }}
                  spacing={4}
                  w={{ base: "full", lg: "80%" }}
                >
                  <Button
                    w={"full"}
                    onClick={() => setSource("personal-answer")}
                    bgColor={source == "personal-answer" ? "button" : undefined}
                  >
                    Sumber jawaban sendiri
                  </Button>
                  <Button
                    w={"full"}
                    onClick={() => setSource("fully-ai")}
                    bgColor={source == "fully-ai" ? "button" : undefined}
                  >
                    Sumber jawaban sebagian AI
                  </Button>
                  <Button
                    w={"full"}
                    onClick={() => setSource("ai-paraphrase")}
                    bgColor={source == "ai-paraphrase" ? "button" : undefined}
                  >
                    Sumber jawaban seluruhnya AI
                  </Button>
                </Stack>
                <Button
                  bgColor={"button"}
                  w={{ base: "full", lg: "25%" }}
                  isDisabled={
                    !source || answer.length === 0 || question.length === 0
                  }
                  isLoading={loadingAnswer}
                  loadingText="Loading..."
                  onClick={() => handleSubmit()}
                >
                  Submit
                </Button>
              </VStack>
              <Text>
                Apabila ada pertanyaan, silahkan kontak saya lewat ID Line{" "}
                <strong>kobusryan</strong> atau nomor Whatsapp{" "}
                <strong>08987481816</strong>. Terima kasih.
              </Text>
            </VStack>
          </Flex>
        )}
      </VStack>
      {isLoadingCheckSession ? null : (
        <ModalAgree
          onAgree={() => handleAgree()}
          isOpen={!sessionActive}
          onClose={onAgreeModalClose}
          isLoading={isLoadingGetSession}
        />
      )}
      {isLoadingGetSession ? null : (
        <ModalTopic
          isOpen={isModalTopicOpen}
          setOpen={setModalTopicOpen}
          onClose={onTopicModalClose}
        />
      )}
    </>
  );
}

export default App;
