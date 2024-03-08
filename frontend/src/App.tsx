/* eslint-disable react-hooks/exhaustive-deps */
import { BaseSyntheticEvent, useEffect, useState } from "react";
import {
  Button,
  Divider,
  Flex,
  HStack,
  Heading,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  OrderedList,
  Spinner,
  Stack,
  Text,
  Textarea,
  VStack,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import axios, { AxiosError } from "axios";

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
  const [sessionActive, setSessionActive] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const { onClose } = useDisclosure();
  const [answer, setAnswer] = useState("");
  const [keyPresses, setKeyPresses] = useState(initializeKeyPressDict());
  const [backspaceCount, setBackspaceCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [source, setSource] = useState<string>();
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [questionPresented, setQuestionPresented] = useState<string>();
  const [question, setQuestion] = useState("");

  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);

  const getQuestion = async () => {
    setIsLoadingQuestion(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_AXIOS_URL}/chat`,
        { withCredentials: true }
      );
      localStorage.setItem("question_id", response.data.id);
      setQuestion(response.data.question);
      setQuestionPresented(new Date().toISOString());
      setAnswer("");
      setIsLoadingQuestion(false);
    } catch (e) {
      if (!(e instanceof AxiosError)) return;
      toast({ title: "Error", description: "Internal server error" });
      setIsLoadingQuestion(false);
    }
  };

  const getSession = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BASE_AXIOS_URL}/session`, {
        withCredentials: true
      });
      onClose();
      setModalOpen(false);
      await getQuestion();
    } catch (e) {
      if (!(e instanceof AxiosError)) return;
      toast({
        title: "Error",
        description: "Internal server error",
        status: "error"
      });
    }
  };

  const checkSession = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_AXIOS_URL}/session-check`,
        { withCredentials: true }
      );
      if (response.data.session_active) {
        setSessionActive(true);
        setModalOpen(false);
      } else {
        setModalOpen(true);
      }
    } catch (e) {
      if (!(e instanceof AxiosError)) return;
      toast({
        title: "Error",
        description: "Internal server error",
        status: "error"
      });
    }
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

  const handleBlur = () => {
    if (isTyping) {
      const endTime = Date.now();
      const currentDuration = Math.round((endTime - startTime) / 1000);
      setDuration((duration) => duration + currentDuration);
      setIsTyping(false); // Pause typing
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

  const sendAnswer = async () => {
    setIsLoadingAnswer(true);
    try {
      const userAgent = navigator.userAgent;

      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          userAgent
        );
      const isTablet =
        /iPad|Android/i.test(userAgent) && !/Mobile/i.test(userAgent);

      await axios.post(
        `${import.meta.env.VITE_BASE_AXIOS_URL}/chat`,
        {
          question_id: localStorage.getItem("question_id"),
          answer_text: answer,
          backspace_count: backspaceCount,
          letter_click_counts: keyPresses,
          typing_duration: duration,
          question_presented_at: questionPresented,
          answer_submitted_at: new Date().toISOString(),
          total_interaction_time: Math.round(
            (Date.now() - new Date(questionPresented as string).getTime()) /
              1000
          ),
          response_type:
            source === "personal-answer"
              ? "PERSONAL"
              : source === "ai-paraphrase"
                ? "AI_PARAPHRASE"
                : "FULLY_AI",
          device_type: isMobile ? "MOBILE" : isTablet ? "TABLET" : "DESKTOP"
        },
        { withCredentials: true }
      );

      setIsLoadingAnswer(false);
      setQuestion("");

      await getQuestion();
    } catch (e) {
      if (!(e instanceof AxiosError)) return;
      toast({ title: "Error", description: "Internal server error" });
      setIsLoadingAnswer(false);
    }
  };

  useEffect(() => {
    checkSession();
    if (sessionActive) {
      getQuestion();
    }
  }, [sessionActive]);

  useEffect(() => {
    if (answer.length > 0 && !isTyping) {
      setIsTyping(true);
      setStartTime(Date.now());
    }
  }, [answer, isTyping]);

  return (
    <>
      <VStack bgColor={"main"} position={"relative"} minH={"100vh"}>
        <VStack
          bgColor={"navbar"}
          top={0}
          position={"sticky"}
          w={"full"}
          alignItems={"center"}
          justifyContent={"center"}
          zIndex={1}
          color={"white"}
          p={4}
        >
          <Heading>Interview Answer Tracker</Heading>
          <Text fontSize={12}>by Yakobus Iryanto Prasethio</Text>
        </VStack>
        <Flex
          grow={1}
          w={"full"}
          alignItems={"center"}
          direction={"column"}
          p={8}
        >
          <VStack spacing={{ base: 8, lg: 8 }} w={{ base: "full", lg: "60%" }}>
            <VStack spacing={4}>
              <Heading fontSize={30}>
                Beberapa informasi mengenai pertanyaan dan jawaban:
              </Heading>
              <Text fontSize={18}>
                1. Pertanyaan akan disajikan dalam{" "}
                <strong>Bahasa Inggris</strong> dan jawaban Anda perlu
                menggunakan <strong>Bahasa Inggris</strong>
              </Text>
              <Text fontSize={18}>
                2. Anda boleh menjawab pertanyaan berdasarkan pendapat pribadi
                atau menggunakan LLM seperti ChatGPT
              </Text>
              <Text fontSize={18}>
                3. Setelah menjawab pertanyaan, pilih salah satu sumber jawaban
                dan tekan submit
              </Text>
              <Text fontSize={18}>
                4. Setelah menekan submit, pertanyaan selanjutnya akan muncul.{" "}
                <strong>Anda boleh berhenti kapan saja</strong>
              </Text>
            </VStack>
            <Divider />
            <VStack w={"full"} spacing={4}>
              <Text fontSize={18}>Silahkan jawab pertanyaan di bawah ini:</Text>
              {isLoadingQuestion ? (
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
                <Text fontSize={20}>{question}</Text>
              )}

              <Textarea
                value={answer}
                rows={5}
                width={"full"}
                placeholder="Silahkan jawab disini"
                resize={"none"}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyPress}
                onBlur={handleBlur}
                onCopy={handleCopyPaste}
                onPaste={handleCopyPaste}
              />
              <Text fontSize={18}>
                Silahkan pilih salah satu sumber jawaban
              </Text>
              <Stack
                direction={{ base: "column", lg: "row" }}
                spacing={4}
                w={"80%"}
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
                w={"25%"}
                isDisabled={
                  !source || answer.length === 0 || question.length === 0
                }
                isLoading={isLoadingAnswer}
                loadingText="Loading..."
                onClick={() => sendAnswer()}
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
      </VStack>
      <Modal
        isOpen={isModalOpen}
        onClose={onClose}
        isCentered
        size={"2xl"}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Syarat penggunaan</ModalHeader>
          <ModalBody>
            <Stack spacing={4}>
              <Text>Dengan mengakses website ini, Anda setuju bahwa:</Text>
              <OrderedList spacing={4}>
                <ListItem>
                  Aktivitas pengetikan Anda, termasuk durasi pengetikan, akan
                  dilacak untuk tujuan penelitian.
                </ListItem>
                <ListItem>
                  Fungsi copy-paste pada website ini{" "}
                  <strong>dinonaktifkan</strong>.
                </ListItem>
                <ListItem>
                  Semua data yang dikumpulkan anonim dan hanya akan digunakan
                  untuk penelitian skripsi.
                </ListItem>
                <ListItem>
                  Anda tidak akan membagikan informasi sensitif atau pribadi
                  melalui website ini.
                </ListItem>
              </OrderedList>
              <Text fontWeight={700}>
                Terima kasih telah berkontribusi pada penelitian saya.
              </Text>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => getSession()} bgColor={"button"}>
              Saya sudah membaca
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default App;
