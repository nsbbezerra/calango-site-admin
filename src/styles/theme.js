import { theme, extendTheme } from "@chakra-ui/react";

const customtheme = extendTheme({
  ...theme,
  breakpoints: ["30em", "48em", "52em", "62em", "80em"],
  fonts: {
    body: "Montserrat, sans-serif",
    heading: "Montserrat, sans-serif",
    mono: "Montserrat, sans-serif",
  },
  fontWeights: {
    ...theme.fontWeights,
    normal: 400,
    medium: 500,
    bold: 700,
    bolder: 900,
  },
  colors: {
    ...theme.colors,
    purple: {
      100: "#887789",
      200: "#644e65",
      300: "#412743",
      400: "#210024",
      500: "#1e001f",
      600: "#1a001b",
      700: "#160016",
      800: "#100011",
      900: "#090009",
    },
    green: {
      100: "#a8e5a0",
      200: "#88db81",
      300: "#63d161",
      400: "#30c73f",
      500: "#2ea336",
      600: "#2a802d",
      700: "#245f25",
      800: "#1d401b",
      900: "#142312",
    },
  },
});

export default customtheme;
