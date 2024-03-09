import { Heading, VStack, Text } from "@chakra-ui/react";

export function InformationPanel() {
  return (
    <VStack spacing={4}>
      <Heading fontSize={30}>
        Beberapa informasi mengenai pertanyaan dan jawaban:
      </Heading>
      <Text fontSize={18}>
        1. Pertanyaan akan disajikan dalam <strong>Bahasa Inggris</strong> dan
        jawaban Anda perlu menggunakan <strong>Bahasa Inggris</strong>
      </Text>
      <Text fontSize={18}>
        2. Anda boleh menjawab pertanyaan berdasarkan pendapat pribadi atau
        menggunakan LLM seperti ChatGPT
      </Text>
      <Text fontSize={18}>
        3. Setelah menjawab pertanyaan, pilih salah satu sumber jawaban dan
        tekan submit
      </Text>
      <Text fontSize={18}>
        4. Setelah menekan submit, pertanyaan selanjutnya akan muncul.{" "}
        <strong>Anda boleh berhenti kapan saja</strong>. Terima kasih sudah
        berpartisipasi
      </Text>
    </VStack>
  );
}
