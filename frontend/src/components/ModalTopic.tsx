import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
  Input,
  Button,
  Stack
} from "@chakra-ui/react";
import React, { useState } from "react";

type Props = {
  isOpen: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
};

export function ModalTopic({ isOpen, setOpen, onClose }: Props) {
  const [questionTopic, setQuestionTopic] = useState("");

  const submitHandler = () => {
    localStorage.setItem("question_topic", questionTopic);
    setOpen(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size={"lg"}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Jurusan Anda</ModalHeader>
        <ModalBody>
          <Stack spacing={4}>
            <Text>
              Silahkan tulis jurusan yang sedang Anda ambil saat ini{" "}
              <strong>(dalam Bahasa Inggris)</strong>
            </Text>
            <Input
              value={questionTopic}
              onChange={(e) => setQuestionTopic(e.target.value)}
              placeholder="Masukan jurusan Anda disini"
            />
            <Text>
              Informasi ini tidak akan disimpan dan hanya akan digunakan untuk
              membuat pertanyaan wawancara.
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={submitHandler}
            bgColor={"button"}
            isDisabled={questionTopic.length === 0}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
