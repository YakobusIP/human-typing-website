import { useState, useEffect } from "react";
import { Text } from "@chakra-ui/react";

type Props = {
  text: string;
};

const TypingEffect = ({ text }: Props) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = text.split(" ");

  useEffect(() => {
    if (currentWordIndex < words.length) {
      const timer = setTimeout(() => {
        setDisplayedText(
          (prev) =>
            prev + (prev.length > 0 ? " " : "") + words[currentWordIndex]
        );
        setCurrentWordIndex(currentWordIndex + 1);
      }, 100); // Adjust timeout to control typing speed

      return () => clearTimeout(timer); // Cleanup on component unmount or before the next effect runs
    }
  }, [currentWordIndex, words]);

  return (
    <Text fontSize={20} textAlign={"center"}>
      {displayedText}
    </Text>
  );
};

export default TypingEffect;
