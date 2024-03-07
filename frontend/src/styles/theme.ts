import { extendTheme } from "@chakra-ui/react";
import { colors } from "@/styles/colors";
import { Textarea } from "@/styles/textarea";

const theme = extendTheme({ colors, components: { Textarea } });

export default theme;
