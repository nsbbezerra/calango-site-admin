import React from "react";
import { Grid, Box, Flex } from "@chakra-ui/react";

import Header from "./header";
import Routes from "../router/index";

export default function Layout() {
  return (
    <Box w="100vw" h="100vh" maxW="100vw">
      <Grid w="100vw" h="100vh" templateRows="85px 1fr 30px" maxW="100vw">
        <Box>
          <Header />
        </Box>
        <Box h="100%" maxW="100%" overflow="auto" p={10}>
          <Routes />
        </Box>
        <Flex
          bg="green.400"
          h="30px"
          justify="center"
          align="center"
          color="white"
          boxShadow={"-10px -10px 10px rgba(0,0,0,.08)"}
          fontSize="sm"
          fontWeight="700"
          zIndex={1000}
        >
          © 2021 - RIFA PMW, Todos os Direitos Reservados!
        </Flex>
      </Grid>
    </Box>
  );
}
