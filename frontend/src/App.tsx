import { useState } from "react";
import {
  Button,
  Center,
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
  Stack,
  Text,
  Textarea,
  VStack,
  useDisclosure
} from "@chakra-ui/react";

function App() {
  const { isOpen, onClose, onOpen } = useDisclosure({ defaultIsOpen: true });
  const [source, setSource] = useState<string>();

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
          <VStack spacing={16} w={"60%"}>
            <VStack spacing={4}>
              <Text fontSize={20}>
                Beberapa informasi mengenai pertanyaan dan jawaban:
              </Text>
              <Text fontSize={20}>
                1. Pertanyaan akan disajikan dalam{" "}
                <strong>Bahasa Inggris</strong> dan jawaban Anda perlu
                menggunakan <strong>Bahasa Inggris</strong>
              </Text>
              <Text fontSize={20}>
                2. Anda boleh menjawab pertanyaan berdasarkan pendapat pribadi
                atau menggunakan LLM seperti ChatGPT
              </Text>
              <Text fontSize={20}>
                3. Setelah menjawab pertanyaan, pilih salah satu sumber jawaban
                dan tekan submit
              </Text>
              <Text fontSize={20}>
                4. Setelah menekan submit, pertanyaan selanjutnya akan muncul.{" "}
                <strong>Anda boleh berhenti kapan saja</strong>
              </Text>
            </VStack>
            <VStack w={"full"} spacing={4}>
              <Text fontSize={20}>Silahkan jawab pertanyaan di bawah ini:</Text>
              <Text fontSize={24}>Tell me about yourself</Text>
              <Textarea
                rows={5}
                width={"full"}
                placeholder="Silahkan jawab disni"
                resize={"none"}
              />
              <Text fontSize={20}>Silahkan pilih salah satu</Text>
              <HStack spacing={4}>
                <Button
                  onClick={() => setSource("personal-answer")}
                  bgColor={source == "personal-answer" ? "button" : undefined}
                >
                  Sumber jawaban sendiri
                </Button>
                <Button
                  onClick={() => setSource("ai-paraphrase")}
                  bgColor={source == "ai-paraphrase" ? "button" : undefined}
                >
                  Sumber jawaban seluruhnya AI
                </Button>
                <Button
                  onClick={() => setSource("fully-ai")}
                  bgColor={source == "fully-ai" ? "button" : undefined}
                >
                  Sumber jawaban sebagian AI
                </Button>
              </HStack>
              <Button bgColor={"button"} w={"25%"}>
                Submit
              </Button>
            </VStack>
          </VStack>
        </Flex>
      </VStack>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size={"2xl"}>
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
              <Text>
                Terima kasih telah berkontribusi pada penelitian saya.
              </Text>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} bgColor={"button"}>
              Saya sudah membaca
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default App;
