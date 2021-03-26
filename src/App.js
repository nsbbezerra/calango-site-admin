import React, { useEffect } from "react";
import { ChakraProvider, useColorMode } from "@chakra-ui/react";
import theme from "./styles/theme";
import { MemoryRouter as Router } from "react-router-dom";

import Layout from "./components/layout";

function App() {
  const { setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode("light");
  }, []);

  return (
    <Router>
      <ChakraProvider theme={theme} resetCSS={true}>
        <Layout />
      </ChakraProvider>
    </Router>
  );
}

export default App;
