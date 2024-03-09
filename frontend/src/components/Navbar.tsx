import { Heading, Text, VStack } from "@chakra-ui/react";

export function Navbar() {
  return (
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
  );
}
