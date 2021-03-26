import React from "react";
import { Flex, Heading, Image } from "@chakra-ui/react";

import Logo from "../assets/logo.svg";

export default function Home() {
  return (
    <>
      <Flex
        w="100%"
        h="100%"
        align="center"
        justify="center"
        direction="column"
      >
        <Image src={Logo} h="80%" />
        <Heading color="green.400" fontSize="md" mt={10}>
          Sistema desenvolvido em parceria: Calango Criativo e NK Informática
        </Heading>
      </Flex>
    </>
  );
}
