import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Stack,
  OrderedList,
  ListItem,
  Text,
  Button
} from "@chakra-ui/react";

type Props = {
  onAgree: () => void;
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
};

export function ModalAgree({ onAgree, isOpen, onClose, isLoading }: Props) {
  return (
    <Modal
      isOpen={isOpen}
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
              Terima kasih telah berkontribusi pada penelitian saya. Harap
              menggunakan browser Chrome.
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={onAgree}
            bgColor={"button"}
            isLoading={isLoading}
            loadingText="Loading..."
          >
            Saya sudah membaca
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
