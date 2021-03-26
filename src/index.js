import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ColorModeProvider, ColorModeScript } from "@chakra-ui/react";

ReactDOM.render(
  <React.Fragment>
    <ColorModeProvider
      options={{ useSystemColorMode: false, initialColorMode: "light" }}
    >
      <ColorModeScript initialColorMode="light" />
      <App />
    </ColorModeProvider>
  </React.Fragment>,
  document.getElementById("root")
);
