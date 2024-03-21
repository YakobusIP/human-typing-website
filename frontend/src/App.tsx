/* eslint-disable react-hooks/exhaustive-deps */
import { BaseSyntheticEvent, useEffect, useState } from "react";
import {
  Button,
  Divider,
  Flex,
  Stack,
  Text,
  Textarea,
  VStack,
  useToast
} from "@chakra-ui/react";
import { InformationPanel } from "./components/InformationPanel";
import { Navbar } from "./components/Navbar";
import { useAnswer } from "./hooks/useAnswer";

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

  const {
    answer,
    setAnswer,
    sendAnswer,
    isLoading: loadingAnswer,
    error: errorAnswer
  } = useAnswer();

  // Typing metrics state
  const [keyPresses, setKeyPresses] = useState(initializeKeyPressDict());
  const [backspaceCount, setBackspaceCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [source, setSource] = useState<string>();
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(0);

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
    const responseTypeMapping = (source: string | undefined) => {
      switch (source) {
        case "personal-answer":
          return "PERSONAL";
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
      response_type: responseTypeMapping(source)
    });
  };

  useEffect(() => {
    if (errorAnswer) {
      toast({
        title: "Error",
        description: "Internal server error",
        status: "error"
      });
    }
  }, [errorAnswer]);

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
        <Flex
          grow={1}
          w={"full"}
          alignItems={"center"}
          justifyContent={"center"}
          direction={"column"}
          p={8}
        >
          <VStack w={{ base: "full", lg: "60%" }} spacing={8}>
            <Text fontSize={18}>
              Silahkan jawab pertanyaan yang diberikan pada kotak di bawah ini:
            </Text>

            <Textarea
              value={answer}
              rows={8}
              width={"full"}
              placeholder="Silahkan jawab disini"
              resize={"none"}
              onKeyDown={handleKeyPress}
              onChange={(e) => setAnswer(e.target.value)}
              onBlur={handleBlur}
              onFocus={handleFocus}
              onCopy={handleCopyPaste}
              onPaste={handleCopyPaste}
            />
            <Text fontSize={18}>Silahkan pilih salah satu sumber jawaban</Text>
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
                Sumber jawaban AI
              </Button>
            </Stack>
            <Button
              bgColor={"button"}
              w={{ base: "full", lg: "25%" }}
              isDisabled={!source || answer.length === 0}
              isLoading={loadingAnswer}
              loadingText="Loading..."
              onClick={() => handleSubmit()}
            >
              Submit
            </Button>
          </VStack>
        </Flex>
      </VStack>
    </>
  );
}

export default App;
