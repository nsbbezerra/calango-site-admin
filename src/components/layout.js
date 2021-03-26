import React from "react";
import { Grid, Box } from "@chakra-ui/react";

import Header from "./header";
import Routes from "../router/index";

export default function Layout() {
  return (
    <Box w="100vw" h="100vh" overflow="hidden">
      <Grid w="100vw" h="100vh" templateRows="85px 1fr">
        <Box>
          <Header />
        </Box>
        <Box h="100%" maxW="100%" overflow="auto" p={10}>
          <Routes />
        </Box>
      </Grid>
    </Box>
  );
}
