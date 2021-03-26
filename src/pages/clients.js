import React, { useState } from "react";
import {
  Grid,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Box,
  Switch,
  HStack,
  Icon,
  Text,
  Heading,
} from "@chakra-ui/react";
import MaskedInput from "react-text-mask";
import { FaSearch, FaWhatsapp } from "react-icons/fa";

export default function Clients() {
  const [search, setSearch] = useState("all");
  const [text, setText] = useState("");
  const [cpf, setCpf] = useState("");

  return (
    <>
      <Box bg="purple.400" rounded="lg" p={3} mb={10}>
        <Heading fontSize="lg" color="white">
          Gerenciar Clientes
        </Heading>
      </Box>
      <FormControl>
        <FormLabel>Escolha uma opção de busca:</FormLabel>
        <Grid templateColumns="1fr 3fr 1fr" gap="20px">
          <Select
            placeholder="Selecione uma opção"
            focusBorderColor="purple.400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          >
            <option value="all">Todos os clientes</option>
            <option value="name">Buscar por nome</option>
            <option value="cpf">Buscar por CPF</option>
          </Select>

          {search === "cpf" ? (
            <MaskedInput
              mask={[
                /[0-9]/,
                /\d/,
                /\d/,
                ".",
                /\d/,
                /\d/,
                /\d/,
                ".",
                /\d/,
                /\d/,
                /\d/,
                "-",
                /\d/,
                /\d/,
              ]}
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="Digite para buscar"
              id="cpf"
              render={(ref, props) => (
                <Input
                  ref={ref}
                  {...props}
                  focusBorderColor={"purple.400"}
                  isDisabled={search === "all" ? true : false}
                />
              )}
            />
          ) : (
            <Input
              placeholder="Digite para buscar"
              focusBorderColor="purple.400"
              isDisabled={search === "all" ? true : false}
              value={text}
              onChange={(e) => setText(e.target.value.toUpperCase())}
            />
          )}
          <Button isFullWidth leftIcon={<FaSearch />} colorScheme="purple">
            Buscar
          </Button>
        </Grid>
      </FormControl>

      <Box rounded="lg" p={5} borderWidth="1px" mt={10}>
        <Table size="sm">
          <Thead fontWeight="700">
            <Tr>
              <Td w="6%" textAlign="center">
                Criar
              </Td>
              <Td w="6%" textAlign="center">
                Comprar
              </Td>
              <Td w="40%">Nome</Td>
              <Td>CPF</Td>
              <Td>Email</Td>
              <Td w="13%">Telefone</Td>
            </Tr>
          </Thead>

          <Tbody>
            <Tr>
              <Td w="6%" textAlign="center">
                <Switch colorScheme="purple" />
              </Td>
              <Td w="6%" textAlign="center">
                <Switch colorScheme="purple" />
              </Td>
              <Td w="40%">Natanael dos Santos Bezerra</Td>
              <Td>017.067.731-10</Td>
              <Td>contato.nk.info@gmail.com</Td>
              <Td w="13%">
                <HStack>
                  <Icon as={FaWhatsapp} />
                  <Text>(63) 99971-1716</Text>
                </HStack>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </>
  );
}
