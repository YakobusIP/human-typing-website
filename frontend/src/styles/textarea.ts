import { ComponentStyleConfig, SystemStyleFunction } from "@chakra-ui/react";

const defaultTextarea: SystemStyleFunction = () => {
  return {
    border: "1px black solid"
  };
};

export const Textarea: ComponentStyleConfig = {
  variants: {
    default: defaultTextarea
  },
  defaultProps: {
    variant: "default"
  }
};
